import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import CommunityProgramVoucher from '@/models/CommunityProgramVoucher';

// Seed default Family Support Voucher if database collection is empty
async function ensureDefaultVoucher() {
  const count = await CommunityProgramVoucher.countDocuments();
  if (count === 0) {
    await CommunityProgramVoucher.create({
      title: 'Family Support Voucher',
      supportedBy: 'TMSAP Project of V2CC',
      communityType: 'FAMILY_SUPPORT',
      voucherCode: 'FAMILY-V2CC',
      voucherAmount: 3000,
      status: 'OFF', // Default OFF as requested
      noticeMessage:
        'Community household onboarding and verification are in progress. This voucher program will be activated for enrolled member families shortly.',
      features: [
        'Monthly Essential Grocery Hampers (Rice, Pulses, Oil)',
        'Daily Household Essentials & Hygiene Products',
        'Subsidized Pricing for Verified Community Members',
        'Direct Doorstep Delivery Logistics Support',
      ],
    });
  }
}

// GET: Fetch community program vouchers for display
export async function GET() {
  try {
    await connectToDatabase();
    await ensureDefaultVoucher();

    const vouchers = await CommunityProgramVoucher.find().sort({ createdAt: -1 });
    return NextResponse.json({ vouchers });
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
    const { id, title, supportedBy, communityType, voucherCode, voucherAmount, status, noticeMessage, features } = body;

    await connectToDatabase();

    if (id) {
      // Update existing
      const updated = await CommunityProgramVoucher.findByIdAndUpdate(
        id,
        {
          title,
          supportedBy,
          communityType,
          voucherCode: voucherCode ? voucherCode.toUpperCase().trim() : 'FAMILY-V2CC',
          voucherAmount: Number(voucherAmount) || 3000,
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
      title: title || 'Family Support Voucher',
      supportedBy: supportedBy || 'TMSAP Project of V2CC',
      communityType: communityType || 'FAMILY_SUPPORT',
      voucherCode: voucherCode ? voucherCode.toUpperCase().trim() : 'COMMUNITY-V2CC',
      voucherAmount: Number(voucherAmount) || 3000,
      status: status === 'ON' ? 'ON' : 'OFF',
      noticeMessage: noticeMessage || 'Community member voucher program.',
      features: Array.isArray(features) ? features : [],
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
