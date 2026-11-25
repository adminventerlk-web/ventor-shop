import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import { PricingService } from '@/lib/services/pricingService';
import { VoucherService } from '@/lib/services/voucherService';
import Setting from '@/models/Setting';
import StudentVoucher from '@/models/StudentVoucher';

export async function POST(request: Request) {
  try {
    const { items, voucherCode } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items payload' }, { status: 400 });
    }

    if (items.length === 0) {
      return NextResponse.json({
        items: [],
        subtotal: 0,
        itemDiscounts: 0,
        voucherDiscount: 0,
        deliveryFee: 0,
        freeDeliveryThreshold: 75,
        total: 0,
        appliedVoucher: null,
        voucherError: null,
      });
    }

    let customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE' = 'NORMAL';
    let communityId = null;
    let userId = null;

    try {
      await connectToDatabase();
      const user = await getCurrentUser();
      if (user && user.customerType !== 'ADMIN') {
        customerType = user.customerType;
      }
      if (user) {
        communityId = user.communityId;
        userId = user.id;
      }
    } catch {
      // Non-blocking if auth/DB is unavailable
    }

    // 1. Calculate pricing breakdown using PricingService
    const breakdown = await PricingService.calculateCart(items, customerType, communityId);

    let voucherDiscount = 0;
    let voucherError: string | null = null;
    let appliedVoucher = null;

    // 2. Validate voucher if present (or check if user has active VERIFIED Student Voucher)
    if (voucherCode) {
      const cleanCode = voucherCode.toUpperCase().trim();

      // Check if it's a verified student voucher code
      const matchingStudentVoucher = await StudentVoucher.findOne({
        discountCode: cleanCode,
        status: 'VERIFIED',
      });

      if (matchingStudentVoucher) {
        if (matchingStudentVoucher.discountType === 'PERCENTAGE') {
          const pct = matchingStudentVoucher.discountValue || 15;
          voucherDiscount = Math.round((breakdown.subtotal * (pct / 100)) * 100) / 100;
        } else {
          voucherDiscount = Math.min(
            matchingStudentVoucher.discountValue || matchingStudentVoucher.voucherAmount || 2500,
            breakdown.subtotal
          );
        }

        appliedVoucher = {
          code: matchingStudentVoucher.discountCode,
          discountAmount: voucherDiscount,
          discountType: matchingStudentVoucher.discountType || 'FIXED',
          discountValue: matchingStudentVoucher.discountValue,
        };
      }
    }

    if (!appliedVoucher && userId) {
      const activeStudentVoucher = await StudentVoucher.findOne({
        userId: userId,
        status: 'VERIFIED',
      });
      if (activeStudentVoucher && (!voucherCode || voucherCode.toUpperCase().trim() === (activeStudentVoucher.discountCode || '').toUpperCase())) {
        if (activeStudentVoucher.discountType === 'PERCENTAGE') {
          const pct = activeStudentVoucher.discountValue || 15;
          voucherDiscount = Math.round((breakdown.subtotal * (pct / 100)) * 100) / 100;
        } else {
          voucherDiscount = Math.min(
            activeStudentVoucher.discountValue || activeStudentVoucher.voucherAmount || 2500,
            breakdown.subtotal
          );
        }

        appliedVoucher = {
          code: activeStudentVoucher.discountCode || 'STUDENT-V2CC',
          discountAmount: voucherDiscount,
          discountType: activeStudentVoucher.discountType || 'FIXED',
          discountValue: activeStudentVoucher.discountValue,
        };
      }
    }

    if (!appliedVoucher && voucherCode) {
      if (voucherCode.toUpperCase() === 'WELCOME10') {
        voucherDiscount = Math.round(breakdown.subtotal * 0.1 * 100) / 100;
        appliedVoucher = {
          code: 'WELCOME10',
          discountAmount: voucherDiscount,
        };
      } else if (!userId) {
        voucherError = 'Please register or log in to apply this voucher code.';
      } else {
        try {
          const voucherRes = await VoucherService.validateVoucher(
            voucherCode,
            userId,
            items,
            customerType,
            communityId
          );
          voucherDiscount = voucherRes.discountAmount;
          appliedVoucher = {
            code: voucherRes.code,
            discountAmount: voucherRes.discountAmount,
          };
        } catch (err: any) {
          voucherError = err.message || 'Voucher is invalid for this order';
        }
      }
    }

    // 3. Compute final totals
    const finalDiscount = breakdown.itemDiscounts + voucherDiscount;
    const cartTotalAfterDiscount = Math.max(0, breakdown.subtotal - finalDiscount);
    
    let freeDeliveryThreshold = 75;
    try {
      const settings = await Setting.findOne();
      if (settings?.freeDeliveryThreshold) {
        freeDeliveryThreshold = settings.freeDeliveryThreshold;
      }
    } catch {
      // Use default 75
    }

    const defaultDeliveryFee = 12.5;
    const deliveryFee = cartTotalAfterDiscount >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;
    const finalTotal = Math.max(0, cartTotalAfterDiscount + deliveryFee);

    return NextResponse.json({
      items: breakdown.items,
      subtotal: Math.round(breakdown.subtotal * 100) / 100,
      itemDiscounts: Math.round(breakdown.itemDiscounts * 100) / 100,
      voucherDiscount: Math.round(voucherDiscount * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      freeDeliveryThreshold,
      total: Math.round(finalTotal * 100) / 100,
      appliedVoucher,
      voucherError,
    });
  } catch (error: any) {
    console.error('Error in /api/cart/calculate:', error);
    return NextResponse.json({
      items: [],
      subtotal: 0,
      itemDiscounts: 0,
      voucherDiscount: 0,
      deliveryFee: 0,
      freeDeliveryThreshold: 75,
      total: 0,
      appliedVoucher: null,
      voucherError: null,
    });
  }
}
