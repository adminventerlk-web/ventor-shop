import { NextResponse } from 'next/server';
import { doesStudentNameMatch } from '@/lib/utils/voucher';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import StudentVoucher from '@/models/StudentVoucher';

// POST: Verify Student Full Name and Voucher Code to redeem/obtain offer
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to verify and redeem your Student Voucher.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { studentFullName, voucherCode } = body;

    if (!studentFullName || !studentFullName.trim()) {
      return NextResponse.json({ error: 'Student full name is required for verification.' }, { status: 400 });
    }

    if (!voucherCode || !voucherCode.trim()) {
      return NextResponse.json({ error: 'Voucher code is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedCode = voucherCode.trim().toUpperCase();
    const cleanInputName = studentFullName.trim().toLowerCase();

    // Look for student voucher with this code
    const voucher = await StudentVoucher.findOne({
      discountCode: normalizedCode,
    });

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher code not found. Please check the code provided by Admin.' },
        { status: 404 }
      );
    }

    if (voucher.status === 'USED') {
      return NextResponse.json(
        { error: 'This student voucher has already been used. Each voucher can only be used once.' },
        { status: 400 }
      );
    }

    if (voucher.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'This student voucher verification was rejected by Admin.' },
        { status: 400 }
      );
    }

    // If Admin manually issued this code (ISSUED), link the student's Full Name & account and send to Admin for verification!
    if (voucher.status === 'ISSUED') {
      voucher.userId = String(user.id || (user as any)._id || '');
      voucher.userEmail = user.email;
      voucher.userName = studentFullName.trim();
      voucher.status = 'PENDING';
      voucher.appliedAt = new Date();
      await voucher.save();

      return NextResponse.json({
        success: true,
        pendingVerification: true,
        message:
          'Your Full Name and Voucher Code have been submitted to the Admin Dashboard! Once Admin verifies you, your offer will be unlocked.',
        voucher,
      });
    }

    if (voucher.status === 'PENDING') {
      return NextResponse.json({
        success: true,
        pendingVerification: true,
        message: 'Your voucher claim is pending Admin verification. Please wait for Admin approval.',
        voucher,
      });
    }

    // Status is VERIFIED -> Verify name match
    const nameMatches = doesStudentNameMatch(voucher.userName, cleanInputName);

    if (!nameMatches) {
      return NextResponse.json(
        {
          error:
            'Student Full Name does not match the approved voucher record. Please enter your exact registered full name.',
        },
        { status: 400 }
      );
    }

    // Mark as verified/activated in session (actual single-use lock happens at order placement)
    voucher.isRedeemed = true;
    await voucher.save();

    const offerDescription =
      voucher.discountType === 'PERCENTAGE'
        ? `${voucher.discountValue}% OFF on educational books, stationery, and student essentials`
        : `LKR ${voucher.discountValue.toLocaleString()} OFF on educational books, stationery, and student essentials`;

    return NextResponse.json({
      success: true,
      message: 'Student voucher verified successfully! Offer activated on your account.',
      voucher: {
        code: voucher.discountCode,
        discountType: voucher.discountType || 'FIXED',
        discountValue: voucher.discountValue || voucher.voucherAmount || 2500,
        voucherAmount: voucher.voucherAmount || (voucher.discountType === 'FIXED' ? voucher.discountValue : 0),
        offerDescription,
        studentName: voucher.userName,
        institution: voucher.institution,
      },
    });
  } catch (error: any) {
    console.error('Error verifying student voucher:', error);
    return NextResponse.json({ error: 'Failed to verify voucher' }, { status: 500 });
  }
}
