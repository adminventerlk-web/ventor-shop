import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import CommunityProgramVoucher from '@/models/CommunityProgramVoucher';

// Seed default V2CC Community Voucher if database collection is empty
async function ensureDefaultVoucher() {
  const count = await CommunityProgramVoucher.countDocuments();
  if (count === 0) {
    await CommunityProgramVoucher.create({
      title: 'V2CC Community Member Voucher',
      supportedBy: 'V2CC-PMS Community Program',
      communityType: 'V2CC_PMS',
      voucherCode: 'V2CC-COMMUNITY',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      voucherAmount: 0,
      status: 'ON',
      noticeMessage:
        'Exclusive one-time voucher for verified V2CC-PMS Community Members. Verify your V2CC membership with Admin to redeem.',
      features: [
        'One-Time Discount on Storewide Orders for Verified V2CC Members',
        'Supports Either Percentage (%) or Fixed Amount (LKR) Savings',
        'Automatic Verification Against Approved V2CC Membership',
        'Balance Payable Smoothly at Checkout',
      ],
      usedByUserIds: [],
    });
  }
}

// GET: Fetch community program vouchers for display
export async function GET() {
  try {
    await connectToDatabase();
    await ensureDefaultVoucher();

    const user = await getCurrentUser();
    const userIdStr = user ? String(user.id || (user as any)._id) : null;

    const vouchers = await CommunityProgramVoucher.find().sort({ createdAt: -1 });
    const sanitized = vouchers.map((v) => ({
      _id: v._id,
      title: v.title,
      supportedBy: v.supportedBy,
      communityType: v.communityType,
      voucherCode: v.voucherCode,
      discountType: v.discountType || 'FIXED',
      discountValue: v.discountValue ?? v.voucherAmount ?? 0,
      voucherAmount: v.voucherAmount ?? 0,
      status: v.status,
      noticeMessage: v.noticeMessage,
      features: v.features,
      usedCount: v.usedByUserIds?.length || 0,
      hasUsed: userIdStr ? (v.usedByUserIds || []).includes(userIdStr) : false,
      createdAt: v.createdAt,
    }));

    return NextResponse.json({ vouchers: sanitized });
  } catch (error: any) {
    console.error('Error fetching community vouchers:', error);
    return NextResponse.json({ error: 'Failed to fetch community vouchers' }, { status: 500 });
  }
}

// POST: Create or Update a Community Program Voucher (Admin only)
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      title,
      supportedBy,
      communityType,
      voucherCode,
      discountType,
      discountValue,
      voucherAmount,
      status,
      noticeMessage,
      features,
    } = body;

    await connectToDatabase();

    const finalDiscountType = discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED';
    const finalDiscountValue = Number(discountValue ?? voucherAmount ?? (finalDiscountType === 'PERCENTAGE' ? 10 : 3000));
    const finalVoucherAmount = finalDiscountType === 'FIXED' ? finalDiscountValue : 0;

    if (id) {
      // Update existing
      const updated = await CommunityProgramVoucher.findByIdAndUpdate(
        id,
        {
          title,
          supportedBy,
          communityType: communityType || 'V2CC_PMS',
          voucherCode: voucherCode ? voucherCode.toUpperCase().trim() : 'V2CC-COMMUNITY',
          discountType: finalDiscountType,
          discountValue: finalDiscountValue,
          voucherAmount: finalVoucherAmount,
          status: status === 'ON' ? 'ON' : 'OFF',
          noticeMessage,
          features: Array.isArray(features) ? features : [],
        },
        { new: true }
      );
      return NextResponse.json({ success: true, voucher: updated });
    }

    // Create new
    const created = await CommunityProgramVoucher.create({
      title: title || 'V2CC Community Member Voucher',
      supportedBy: supportedBy || 'V2CC-PMS Community Program',
      communityType: communityType || 'V2CC_PMS',
      voucherCode: voucherCode ? voucherCode.toUpperCase().trim() : `V2CC-${Math.floor(1000 + Math.random() * 9000)}`,
      discountType: finalDiscountType,
      discountValue: finalDiscountValue,
      voucherAmount: finalVoucherAmount,
      status: status === 'ON' ? 'ON' : 'OFF',
      noticeMessage: noticeMessage || 'Exclusive one-time voucher for verified V2CC Community Members.',
      features: Array.isArray(features) ? features : [],
      usedByUserIds: [],
    });

    return NextResponse.json({ success: true, voucher: created });
  } catch (error: any) {
    console.error('Error saving community voucher:', error);
    return NextResponse.json({ error: 'Failed to save community voucher' }, { status: 500 });
  }
}

// PATCH: Toggle ON/OFF status of a Community Program Voucher (Admin only)
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { voucherId, status } = body;

    if (!voucherId || !status) {
      return NextResponse.json({ error: 'Voucher ID and Status are required.' }, { status: 400 });
    }

    await connectToDatabase();
    const voucher = await CommunityProgramVoucher.findById(voucherId);

    if (!voucher) {
      return NextResponse.json({ error: 'Community voucher not found.' }, { status: 404 });
    }

    voucher.status = status === 'ON' ? 'ON' : 'OFF';
    await voucher.save();

    return NextResponse.json({
      success: true,
      message: `Community voucher status toggled to ${voucher.status}!`,
      voucher,
    });
  } catch (error: any) {
    console.error('Error toggling community voucher status:', error);
    return NextResponse.json({ error: 'Failed to toggle status' }, { status: 500 });
  }
}
