import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import StudentVoucher from '@/models/StudentVoucher';

// GET: Fetch current user's Student Voucher Application status
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ voucher: null, authenticated: false });
    }

    await connectToDatabase();
    const existing = await StudentVoucher.findOne({ userId: (user.id || (user as any)._id) }).sort({ createdAt: -1 });

    return NextResponse.json({
      voucher: existing || null,
      authenticated: true,
    });
  } catch (error: any) {
    console.error('Error fetching student voucher:', error);
    return NextResponse.json({ error: 'Failed to fetch voucher status' }, { status: 500 });
  }
}

// POST: Submit a new Student Voucher Claim
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to claim a student voucher.' }, { status: 401 });
    }

    const body = await req.json();
    const { institution, studentIdNumber } = body;

    if (!institution || !institution.trim()) {
      return NextResponse.json({ error: 'School / University name is required.' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already submitted
    const existing = await StudentVoucher.findOne({ userId: (user.id || (user as any)._id) });

    if (existing) {
      if (existing.status === 'PENDING') {
        return NextResponse.json({
          message: 'Your student voucher application is already pending verification.',
          voucher: existing,
        });
      }
      if (existing.status === 'VERIFIED') {
        return NextResponse.json({
          message: 'Your student voucher is already verified and active!',
          voucher: existing,
        });
      }
    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

    const voucher = await StudentVoucher.create({
      userId: (user.id || (user as any)._id),
      userEmail: user.email,
      userName: fullName,
      institution: institution.trim(),
      studentIdNumber: studentIdNumber ? studentIdNumber.trim() : '',
      status: 'PENDING',
      voucherAmount: 2500, // LKR 2,500 default value
      discountCode: 'STUDENT-V2CC',
      appliedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Student Gift Voucher application submitted successfully! Pending verification by admin.',
      voucher,
    });
  } catch (error: any) {
    console.error('Error submitting student voucher claim:', error);
    return NextResponse.json({ error: 'Failed to submit voucher claim' }, { status: 500 });
  }
}
