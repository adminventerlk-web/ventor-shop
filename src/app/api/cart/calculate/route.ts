import { NextResponse } from 'next/server';
import { doesStudentNameMatch } from '@/lib/utils/voucher';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import { PricingService } from '@/lib/services/pricingService';
import { VoucherService } from '@/lib/services/voucherService';
import Setting from '@/models/Setting';
import StudentVoucher from '@/models/StudentVoucher';
import CommunityProgramVoucher from '@/models/CommunityProgramVoucher';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { items, voucherCode, studentFullName } = await request.json();

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

    // 2. Validate voucher if present
    if (voucherCode) {
      const cleanCode = voucherCode.toUpperCase().trim();

      // 2a. Check if it's a Student Voucher code
      const matchingStudentVoucher = await StudentVoucher.findOne({
        discountCode: cleanCode,
      });

      if (matchingStudentVoucher) {
        if (matchingStudentVoucher.status === 'USED') {
          voucherError = 'This student voucher has already been used. Each voucher can only be used once.';
        } else if (matchingStudentVoucher.status === 'REJECTED') {
          voucherError = 'This student voucher was rejected by Admin.';
        } else if (matchingStudentVoucher.status === 'ISSUED' || matchingStudentVoucher.status === 'PENDING') {
          voucherError = 'This student voucher is pending Admin verification. Please verify it on the Vouchers page first.';
        } else if (matchingStudentVoucher.status === 'VERIFIED') {
          // STRICT NAME VERIFICATION REQUIRED!
          if (!studentFullName || !studentFullName.trim()) {
            voucherError = 'Student Full Name is required to verify and apply this voucher.';
          } else {
            const nameMatches = doesStudentNameMatch(matchingStudentVoucher.userName, studentFullName);

            if (!nameMatches) {
              voucherError = 'Verification failed: Student Full Name does not match this voucher code.';
            } else {
              // Success! Calculate discount (Percentage or Fixed Amount)
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
                studentName: matchingStudentVoucher.userName,
              };
            }
          }
        }
      } else {
        // 2b. Check if it's an active V2CC Community Program Voucher
        const communityVoucher = await CommunityProgramVoucher.findOne({
          voucherCode: cleanCode,
          status: 'ON',
        });

        if (communityVoucher) {
          if (!userId) {
            voucherError = 'Please log in as a verified V2CC Member to use this Community Voucher.';
          } else {
            const dbUser = await User.findById(userId).select('communityStatus customerType');
            const isVerifiedV2CC =
              dbUser &&
              (dbUser.communityStatus === 'APPROVED' ||
                dbUser.customerType === 'COMMUNITY' ||
                dbUser.customerType === 'V2CC_PMS_MEMBER') &&
              dbUser.communityStatus !== 'PENDING';

            if (!isVerifiedV2CC) {
              voucherError =
                dbUser?.communityStatus === 'PENDING'
                  ? 'Your V2CC membership is pending Admin verification. You can use this voucher once approved.'
                  : 'This Community Voucher is exclusively for verified V2CC Members.';
            } else if ((communityVoucher.usedByUserIds || []).includes(String(userId))) {
              voucherError = 'You have already used this Community Voucher. Each voucher can only be used once.';
            } else {
              const dType = communityVoucher.discountType || 'FIXED';
              const dVal = communityVoucher.discountValue ?? communityVoucher.voucherAmount ?? 0;
              if (dType === 'PERCENTAGE') {
                voucherDiscount = Math.round((breakdown.subtotal * (dVal / 100)) * 100) / 100;
              } else {
                voucherDiscount = Math.min(dVal, breakdown.subtotal);
              }
              appliedVoucher = {
                code: communityVoucher.voucherCode,
                discountAmount: voucherDiscount,
                discountType: dType,
                discountValue: dVal,
              };
            }
          }
        } else if (cleanCode === 'WELCOME10') {
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
