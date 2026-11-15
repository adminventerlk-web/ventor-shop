import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { requireVendor } from '@/lib/auth/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';

// In-memory vendor orders registry fallback
declare global {
  // eslint-disable-next-line no-var
  var globalVendorOrders: Map<string, any[]> | undefined;
}

const vendorOrdersStore = global.globalVendorOrders || new Map<string, any[]>();
if (!global.globalVendorOrders) {
  global.globalVendorOrders = vendorOrdersStore;
}

export function saveInMemoryVendorOrder(vendorEmail: string, orderData: any) {
  const existing = vendorOrdersStore.get(vendorEmail.toLowerCase().trim()) || [];
  existing.unshift(orderData);
  vendorOrdersStore.set(vendorEmail.toLowerCase().trim(), existing);
}

export async function GET() {
  try {
    const user = await requireVendor();
    let vendorOrders: any[] = [];

    try {
      await connectToDatabase();

      // Find products belonging to this vendor to match order items
      const vendorProducts = await Product.find({
        $or: [
          { vendorId: user.id },
          ...(user.shopSlug ? [{ shopSlug: user.shopSlug }] : []),
          ...(user.shopName ? [{ shopName: user.shopName }] : []),
        ],
      }).select('_id name');

      const vendorProductIds = new Set(vendorProducts.map((p) => p._id.toString()));

      // Find orders matching vendorId or productIds
      const dbOrders = await Order.find({
        $or: [
          { 'items.vendorId': user.id },
          ...(user.shopName ? [{ 'items.shopName': user.shopName }] : []),
          { 'items.productId': { $in: Array.from(vendorProductIds) } },
        ],
      }).sort({ createdAt: -1 });

      if (dbOrders && dbOrders.length > 0) {
        vendorOrders = dbOrders.map((ord) => {
          const matchingItems = ord.items.filter(
            (item: any) =>
              String(item.vendorId) === String(user.id) ||
              item.shopName === user.shopName ||
              vendorProductIds.has(item.productId?.toString())
          );

          const vendorSubtotal = matchingItems.reduce(
            (acc: number, curr: any) => acc + (curr.total || curr.price * curr.quantity),
            0
          );

          return {
            _id: ord._id.toString(),
            orderNumber: ord.orderNumber,
            customerName: ord.deliveryAddress?.fullName || 'Customer',
            customerPhone: ord.deliveryAddress?.phone || '',
            deliveryAddress: ord.deliveryAddress,
            orderStatus: ord.orderStatus,
            paymentStatus: ord.paymentStatus,
            createdAt: ord.createdAt,
            items: matchingItems,
            vendorTotal: vendorSubtotal,
          };
        });
      }
    } catch (dbErr) {
      console.warn('DB error in /api/vendor/orders GET:', dbErr);
    }

    // Merge in-memory vendor orders if DB was empty
    const memOrders = vendorOrdersStore.get(user.email.toLowerCase().trim()) || [];
    if (vendorOrders.length === 0 && memOrders.length > 0) {
      vendorOrders = memOrders;
    }

    return NextResponse.json({
      success: true,
      orders: vendorOrders,
    });
  } catch (error: any) {
    console.error('Error fetching vendor orders:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

