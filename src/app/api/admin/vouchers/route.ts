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

// PATCH: Approve (Verify) or Reject a Student Voucher
export async function PATCH(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { voucherId, action, voucherAmount, adminNotes } = body;

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
      if (voucherAmount && typeof voucherAmount === 'number') {
        voucher.voucherAmount = voucherAmount;
      }
    } else if (action === 'REJECT') {
      voucher.status = 'REJECTED';
      voucher.rejectedAt = new Date();
    } else if (action === 'MARK_USED') {
      voucher.status = 'USED';
      voucher.usedAt = new Date();
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
        details: `Student Voucher for ${voucher.userName} (${voucher.userEmail}) set to ${voucher.status} (Amount: LKR ${voucher.voucherAmount}).`,
        ipAddress: '127.0.0.1',
      });
    } catch (e) {
      console.error('Failed to log audit event:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Voucher successfully ${action === 'REJECT' ? 'rejected' : 'verified and approved'}!`,
      voucher,
    });
  } catch (error: any) {
    console.error('Error updating voucher status:', error);
    return NextResponse.json({ error: 'Failed to update voucher status' }, { status: 500 });
  }
}
