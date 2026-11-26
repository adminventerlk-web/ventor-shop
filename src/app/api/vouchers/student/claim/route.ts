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
      return NextResponse.json(
        { error: 'Only registered students can apply for the Student Gift Voucher. Please register or log in first.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fullName, institution, studentIdNumber, phone, gradeOrYear } = body;

    if (!institution || !institution.trim()) {
      return NextResponse.json({ error: 'School / University / Institute name is required.' }, { status: 400 });
    }

    const resolvedFullName = (fullName && fullName.trim()) || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

    await connectToDatabase();

    // Check if user already submitted
    const existing = await StudentVoucher.findOne({ userId: (user.id || (user as any)._id) });

    if (existing) {
      if (existing.status === 'PENDING') {
        return NextResponse.json({
          message: 'Your student voucher application is already submitted and pending admin verification.',
          voucher: existing,
        });
      }
      if (existing.status === 'VERIFIED') {
        return NextResponse.json({
          message: 'Your student voucher is already verified and active! Check your code below.',
          voucher: existing,
        });
      }
      if (existing.status === 'REJECTED') {
        // Allow re-submission
        existing.userName = resolvedFullName;
        existing.institution = institution.trim();
        existing.studentIdNumber = studentIdNumber ? studentIdNumber.trim() : '';
        existing.phone = phone ? phone.trim() : '';
        existing.gradeOrYear = gradeOrYear ? gradeOrYear.trim() : '';
        existing.status = 'PENDING';
        existing.appliedAt = new Date();
        await existing.save();

        return NextResponse.json({
          success: true,
          message: 'Student Gift Voucher re-application submitted successfully! Pending verification by admin.',
          voucher: existing,
        });
      }
    }

    const voucher = await StudentVoucher.create({
      userId: (user.id || (user as any)._id),
      userEmail: user.email,
      userName: resolvedFullName,
      institution: institution.trim(),
      studentIdNumber: studentIdNumber ? studentIdNumber.trim() : '',
      phone: phone ? phone.trim() : '',
      gradeOrYear: gradeOrYear ? gradeOrYear.trim() : '',
      status: 'PENDING',
      discountType: 'PERCENTAGE',
      discountValue: 15, // Default percentage
      voucherAmount: 0,
      discountCode: 'PENDING_APPROVAL',
      isRedeemed: false,
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
