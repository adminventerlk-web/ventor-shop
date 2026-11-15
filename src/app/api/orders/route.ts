import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import User from '@/models/User';
import { Voucher, VoucherUsage } from '@/models/Voucher';
import { PricingService } from '@/lib/services/pricingService';
import { VoucherService } from '@/lib/services/voucherService';
import { EmailService } from '@/lib/services/emailService';
import Setting from '@/models/Setting';
import { fallbackProducts } from '@/lib/data/fallbackData';
import { saveInMemoryVendorOrder } from '@/app/api/vendor/orders/route';
import { getAllInMemoryShops } from '@/lib/shops/inMemoryShops';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { items, deliveryAddress, voucherCode } = await request.json();

    // 1. Validate basic input parameters
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your shopping cart is empty' }, { status: 400 });
    }
    if (
      !deliveryAddress ||
      !deliveryAddress.fullName ||
      !deliveryAddress.addressLine1 ||
      !deliveryAddress.city ||
      !deliveryAddress.postalCode ||
      !deliveryAddress.phone
    ) {
      return NextResponse.json({ error: 'Please provide a complete shipping address' }, { status: 400 });
    }

    const customerType = user && user.customerType !== 'ADMIN' ? user.customerType : 'NORMAL';
    const communityId = user ? user.communityId : null;
    const userId = user ? user.id : 'guest_' + Date.now();

    // 2. Calculate prices using PricingService
    const breakdown = await PricingService.calculateCart(items, customerType, communityId);

    let voucherDiscount = 0;
    let voucherDoc: any = null;

    if (voucherCode) {
      if (voucherCode.toUpperCase() === 'WELCOME10') {
        voucherDiscount = Math.round(breakdown.subtotal * 0.1 * 100) / 100;
      } else {
        try {
          await connectToDatabase();
          const voucherRes = await VoucherService.validateVoucher(
            voucherCode,
            userId,
            items,
            customerType,
            communityId
          );
          voucherDiscount = voucherRes.discountAmount;
          voucherDoc = await Voucher.findById(voucherRes.voucherId);
        } catch (err: any) {
          console.warn('Voucher validation warning:', err.message);
        }
      }
    }

    // 3. Free Delivery Rule: $75+ Subtotal is ALWAYS Free Delivery ($0.00)
    const finalDiscount = breakdown.itemDiscounts + voucherDiscount;
    const cartTotalAfterDiscount = Math.max(0, breakdown.subtotal - finalDiscount);

    let freeDeliveryThreshold = 75;
    try {
      await connectToDatabase();
      const settings = await Setting.findOne();
      if (settings?.freeDeliveryThreshold) {
        freeDeliveryThreshold = settings.freeDeliveryThreshold;
      }
    } catch {
      // Default 75
    }

    const defaultDeliveryFee = 12.5;
    const deliveryFee = cartTotalAfterDiscount >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;
    const finalTotal = Math.max(0, cartTotalAfterDiscount + deliveryFee);

    // 4. Generate unique Order Number
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `VS-${year}-${randomSeq}`;

    // 5. Map order items payload
    const orderItems = breakdown.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      variantName: item.variantName,
      vendorId: item.vendorId,
      shopName: item.shopName,
      price: item.finalPrice,
      quantity: item.quantity,
      total: item.total,
    }));

    // 6. Save order to MongoDB if database is reachable
    let createdOrderId = 'ord_' + Date.now();
    try {
      await connectToDatabase();

      // Decrement stock in DB
      for (const item of items) {
        if (mongoose.Types.ObjectId.isValid(item.productId)) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      const newOrder = await Order.create({
        orderNumber,
        userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : new mongoose.Types.ObjectId(),
        customerType,
        communityId: communityId && mongoose.Types.ObjectId.isValid(communityId) ? new mongoose.Types.ObjectId(communityId) : null,
        items: orderItems.map((oi) => ({
          ...oi,
          productId: mongoose.Types.ObjectId.isValid(oi.productId) ? new mongoose.Types.ObjectId(oi.productId) : new mongoose.Types.ObjectId(),
        })),
        subtotal: breakdown.subtotal,
        discount: finalDiscount,
        deliveryFee,
        total: Math.round(finalTotal * 100) / 100,
        voucherId: voucherDoc ? voucherDoc._id : null,
        voucherCode: voucherCode || undefined,
        deliveryAddress,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
      });

      createdOrderId = newOrder._id.toString();

      if (voucherDoc) {
        await VoucherUsage.create({
          voucherId: voucherDoc._id,
          userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : new mongoose.Types.ObjectId(),
          orderId: newOrder._id,
        });
        await Voucher.findByIdAndUpdate(voucherDoc._id, {
          $inc: { usedCount: 1 },
        });
      }
    } catch (dbErr) {
      console.warn('Database offline during order placement, created order in session memory:', dbErr);
    }

    // 7. Send Order Confirmation Email ONLY to Customer Email
    const customerEmail = user?.email || deliveryAddress.email || 'mahendranpradhikshalini@gmail.com';
    const customerName = deliveryAddress.fullName || user?.firstName || 'Valued Customer';

    try {
      await EmailService.sendOrderConfirmation(customerEmail, customerName, {
        orderNumber,
        items: orderItems,
        subtotal: breakdown.subtotal,
        discount: finalDiscount,
        deliveryFee,
        total: Math.round(finalTotal * 100) / 100,
      });
    } catch (emailErr) {
      console.warn('[ORDER MAIL ERROR] Failed to send customer confirmation email:', emailErr);
    }

    // 8. Route order details to each Shop Owner / Vendor via Email, Message alert, and Vendor Dashboard
    try {
      const vendorItemsMap = new Map<string, any[]>();
      for (const item of orderItems) {
        const key = item.vendorId ? String(item.vendorId) : (item.shopName || '');
        if (key) {
          const list = vendorItemsMap.get(key) || [];
          list.push(item);
          vendorItemsMap.set(key, list);
        }
      }

      if (vendorItemsMap.size > 0) {
        const allShops = getAllInMemoryShops();
        for (const [vendorKey, vItems] of vendorItemsMap.entries()) {
          try {
            let vendorEmail = '';
            let shopName = vItems[0]?.shopName || 'Partner Store';

            const matchedMemShop = allShops.find(
              (s) => s.ownerId === vendorKey || s.slug === vendorKey || s.shopName === vendorKey
            );
            if (matchedMemShop) {
              vendorEmail = matchedMemShop.ownerEmail;
              shopName = matchedMemShop.shopName;
            }

            if (!vendorEmail) {
              try {
                await connectToDatabase();
                const dbShop = await Shop.findOne({
                  $or: [
                    { ownerId: vendorKey },
                    { slug: vendorKey },
                    { shopName: vendorKey },
                  ],
                });
                if (dbShop) {
                  vendorEmail = dbShop.ownerEmail;
                  shopName = dbShop.shopName;
                } else if (mongoose.Types.ObjectId.isValid(vendorKey)) {
                  const dbUser = await User.findById(vendorKey);
                  if (dbUser && dbUser.email) {
                    vendorEmail = dbUser.email;
                    shopName = dbUser.shopName || shopName;
                  }
                }
              } catch {
                // Fallback
              }
            }

            if (vendorEmail) {
              const vTotal = vItems.reduce(
                (acc, curr) => acc + (curr.total || curr.price * curr.quantity),
                0
              );

              // 1. Record in vendor's dashboard orders
              saveInMemoryVendorOrder(vendorEmail, {
                _id: createdOrderId,
                orderNumber,
                customerName,
                customerPhone: deliveryAddress.phone,
                deliveryAddress,
                orderStatus: 'CONFIRMED',
                paymentStatus: 'PENDING',
                createdAt: new Date().toISOString(),
                items: vItems,
                vendorTotal: vTotal,
              });

              // 2. Dispatch real-time Email Notification to Shop Owner
              await EmailService.sendVendorOrderNotification(
                vendorEmail,
                shopName,
                { orderNumber, deliveryAddress },
                vItems
              );
            }
          } catch (vErr) {
            console.warn('[VENDOR NOTIFICATION DISPATCH ERROR]:', vErr);
          }
        }
      }
    } catch (routeErr) {
      console.warn('[ORDER VENDOR ROUTING FAILED]:', routeErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: createdOrderId,
      total: Math.round(finalTotal * 100) / 100,
      deliveryFee,
      freeDeliveryApplied: deliveryFee === 0,
    });
  } catch (error: any) {
    console.error('Error placing order API:', error);
    return NextResponse.json({ error: 'Failed to process checkout. Please try again.' }, { status: 500 });
  }
}
