import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import StudentVoucher from '@/models/StudentVoucher';
import AuditLog from '@/models/AuditLog';

// Helper to verify Admin authorization
async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return false;
  }
  return user;
}

// GET: List all student voucher applications for Admin
export async function GET() {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    await connectToDatabase();
    const vouchers = await StudentVoucher.find().sort({ createdAt: -1 });

    return NextResponse.json({ vouchers });
  } catch (error: any) {
    console.error('Error fetching admin vouchers:', error);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}

// POST: Admin manually creates/issues a Student Voucher for specific students
export async function POST(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      studentFullName,
      studentEmail,
      institution,
      discountCode,
      discountType,
      discountValue,
      adminNotes,
      autoVerify,
    } = body;

    const cleanCode = (discountCode && discountCode.trim())
      ? discountCode.trim().toUpperCase()
      : `STU-${Math.floor(10000 + Math.random() * 90000)}`;

    await connectToDatabase();

    const existingCode = await StudentVoucher.findOne({ discountCode: cleanCode });
    if (existingCode) {
      return NextResponse.json({ error: `Voucher code "${cleanCode}" already exists.` }, { status: 400 });
    }

    const finalDiscountType = discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED';
    const finalDiscountValue = Number(discountValue || (finalDiscountType === 'PERCENTAGE' ? 15 : 2500));
    const hasName = Boolean(studentFullName && studentFullName.trim());
    const initialStatus = autoVerify && hasName ? 'VERIFIED' : 'ISSUED';

    const voucher = await StudentVoucher.create({
      userId: '',
      userEmail: studentEmail ? studentEmail.trim().toLowerCase() : '',
      userName: hasName ? studentFullName.trim() : '',
      institution: institution ? institution.trim() : 'VENTERPRISE Student Program',
      status: initialStatus,
      discountType: finalDiscountType,
      discountValue: finalDiscountValue,
      voucherAmount: finalDiscountType === 'FIXED' ? finalDiscountValue : 0,
      discountCode: cleanCode,
      isRedeemed: false,
      appliedAt: new Date(),
      verifiedAt: initialStatus === 'VERIFIED' ? new Date() : undefined,
      adminNotes: adminNotes ? adminNotes.trim() : 'Manually issued by Admin',
    });

    return NextResponse.json({
      success: true,
      message: `Student voucher ${cleanCode} created (${initialStatus}).`,
      voucher,
    });
  } catch (error: any) {
    console.error('Error creating student voucher:', error);
    return NextResponse.json({ error: 'Failed to create student voucher' }, { status: 500 });
  }
}

// PATCH: Approve (Verify) or Reject a Student Voucher
export async function PATCH(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { voucherId, action, discountType, discountValue, voucherAmount, discountCode, adminNotes } = body;

    if (!voucherId || !action) {
      return NextResponse.json({ error: 'Voucher ID and Action are required.' }, { status: 400 });
    }

    await connectToDatabase();
    const voucher = await StudentVoucher.findById(voucherId);

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher application not found.' }, { status: 404 });
    }

    if (action === 'APPROVE' || action === 'VERIFY') {
      voucher.status = 'VERIFIED';
      voucher.verifiedAt = new Date();

      // Configure Discount Type (Percentage vs Fixed Amount)
      const finalDiscountType = discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED';
      voucher.discountType = finalDiscountType;

      const val = Number(discountValue || voucherAmount || (finalDiscountType === 'PERCENTAGE' ? 15 : 2500));
      voucher.discountValue = val;
      voucher.voucherAmount = finalDiscountType === 'FIXED' ? val : 0;

      // Assign exclusive student voucher code if requested or generated
      if (discountCode && discountCode.trim()) {
        voucher.discountCode = discountCode.trim().toUpperCase();
      } else if (!voucher.discountCode || voucher.discountCode === 'STUDENT-V2CC' || voucher.discountCode === 'PENDING_APPROVAL') {
        voucher.discountCode = `STU-${Math.floor(10000 + Math.random() * 90000)}`;
      }
    } else if (action === 'REJECT') {
      voucher.status = 'REJECTED';
      voucher.rejectedAt = new Date();
    } else if (action === 'MARK_USED') {
      voucher.status = 'USED';
      voucher.usedAt = new Date();
    } else if (action === 'TOGGLE_STATUS') {
      voucher.status = voucher.status === 'VERIFIED' ? 'ISSUED' : 'VERIFIED';
      if (voucher.status === 'VERIFIED') {
        voucher.verifiedAt = new Date();
      }
    }

    if (adminNotes !== undefined) {
      voucher.adminNotes = adminNotes;
    }

    await voucher.save();

    try {
      const adminName = `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || adminUser.email;
      await AuditLog.create({
        adminId: (adminUser.id || (adminUser as any)._id),
        adminEmail: adminUser.email,
        adminName,
        action: `STUDENT_VOUCHER_${action}`,
        targetModel: 'StudentVoucher',
        targetId: voucher._id.toString(),
        details: `Student Voucher for ${voucher.userName} (${voucher.userEmail}) set to ${voucher.status} (Type: ${voucher.discountType}, Value: ${voucher.discountValue}, Code: ${voucher.discountCode}).`,
        ipAddress: '127.0.0.1',
      });
    } catch (e) {
      console.error('Failed to log audit event:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Voucher successfully ${action === 'REJECT' ? 'rejected' : action === 'TOGGLE_STATUS' ? `status updated to ${voucher.status}` : 'verified and approved'}!`,
      voucher,
    });
  } catch (error: any) {
    console.error('Error updating voucher status:', error);
    return NextResponse.json({ error: 'Failed to update voucher status' }, { status: 500 });
  }
}

// PUT: Full update/edit of a Student Voucher (Admin only)
export async function PUT(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      voucherId,
      studentFullName,
      studentEmail,
      institution,
      studentIdNumber,
      discountCode,
      discountType,
      discountValue,
      status,
      adminNotes,
    } = body;

    if (!voucherId) {
      return NextResponse.json({ error: 'Voucher ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const voucher = await StudentVoucher.findById(voucherId);

    if (!voucher) {
      return NextResponse.json({ error: 'Student voucher not found.' }, { status: 404 });
    }

    if (discountCode && discountCode.trim()) {
      const cleanCode = discountCode.trim().toUpperCase();
      const duplicate = await StudentVoucher.findOne({
        discountCode: cleanCode,
        _id: { $ne: voucherId },
      });
      if (duplicate) {
        return NextResponse.json({ error: `Voucher code "${cleanCode}" is already in use.` }, { status: 400 });
      }
      voucher.discountCode = cleanCode;
    }

    if (studentFullName !== undefined) voucher.userName = studentFullName.trim();
    if (studentEmail !== undefined) voucher.userEmail = studentEmail.trim().toLowerCase();
    if (institution !== undefined) voucher.institution = institution.trim();
    if (studentIdNumber !== undefined) voucher.studentIdNumber = studentIdNumber.trim();
    if (adminNotes !== undefined) voucher.adminNotes = adminNotes.trim();

    if (discountType === 'PERCENTAGE' || discountType === 'FIXED') {
      voucher.discountType = discountType;
    }

    if (discountValue !== undefined && !isNaN(Number(discountValue))) {
      const val = Number(discountValue);
      voucher.discountValue = val;
      voucher.voucherAmount = voucher.discountType === 'FIXED' ? val : 0;
    }

    if (status && ['ISSUED', 'PENDING', 'VERIFIED', 'REJECTED', 'USED'].includes(status)) {
      voucher.status = status;
      if (status === 'VERIFIED' && !voucher.verifiedAt) {
        voucher.verifiedAt = new Date();
      }
    }

    await voucher.save();

    return NextResponse.json({
      success: true,
      message: 'Student voucher updated successfully!',
      voucher,
    });
  } catch (error: any) {
    console.error('Error editing student voucher:', error);
    return NextResponse.json({ error: 'Failed to update student voucher' }, { status: 500 });
  }
}

// DELETE: Remove a Student Voucher (Admin only)
export async function DELETE(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let voucherId = searchParams.get('voucherId');

    if (!voucherId) {
      try {
        const body = await req.json();
        voucherId = body.voucherId;
      } catch {}
    }

    if (!voucherId) {
      return NextResponse.json({ error: 'Voucher ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await StudentVoucher.findByIdAndDelete(voucherId);

    if (!deleted) {
      return NextResponse.json({ error: 'Student voucher not found.' }, { status: 404 });
    }

    try {
      const adminName = `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || adminUser.email;
      await AuditLog.create({
        adminId: (adminUser.id || (adminUser as any)._id),
        adminEmail: adminUser.email,
        adminName,
        action: 'STUDENT_VOUCHER_DELETED',
        targetModel: 'StudentVoucher',
        targetId: voucherId,
        details: `Deleted student voucher "${deleted.discountCode}" for ${deleted.userName || 'unclaimed'}.`,
        ipAddress: '127.0.0.1',
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Student voucher "${deleted.discountCode}" deleted successfully!`,
    });
  } catch (error: any) {
    console.error('Error deleting student voucher:', error);
    return NextResponse.json({ error: 'Failed to delete student voucher' }, { status: 500 });
  }
}
