import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import AuditLog from '@/models/AuditLog';

// Helper to seed sample audit logs if database is empty
async function seedInitialLogsIfEmpty() {
  const count = await AuditLog.countDocuments();
  if (count === 0) {
    await AuditLog.create([
      {
        adminEmail: 'admin@ventershop.com',
        adminName: 'System Administrator',
        action: 'SYSTEM_INITIALIZATION',
        targetModel: 'System',
        details: 'VENTERSHOP Multi-Category E-Commerce Platform initialized with Ceylon Export & Local catalog.',
        ipAddress: '127.0.0.1',
      },
      {
        adminEmail: 'admin@ventershop.com',
        adminName: 'System Administrator',
        action: 'STUDENT_VOUCHER_POLICY_UPDATED',
        targetModel: 'StudentVoucher',
        details: 'Approved Educating Bank System LKR 2,500 Student Gift Voucher subsidy verification workflow.',
        ipAddress: '127.0.0.1',
      },
      {
        adminEmail: 'admin@ventershop.com',
        adminName: 'System Administrator',
        action: 'COMMUNITY_PROGRAM_TOGGLED',
        targetModel: 'CommunityProgramVoucher',
        details: 'Configured Family Support Voucher (TMSAP Project of V2CC) dynamic ON/OFF status supporter card.',
        ipAddress: '127.0.0.1',
      },
      {
        adminEmail: 'admin@ventershop.com',
        adminName: 'System Administrator',
        action: 'STORE_SETTINGS_VERIFIED',
        targetModel: 'Setting',
        details: 'Verified multi-currency (LKR / CAD / USD) and islandwide delivery threshold settings.',
        ipAddress: '127.0.0.1',
      },
    ]);
  }
}

export async function GET() {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    await connectToDatabase();
    await seedInitialLogsIfEmpty();

    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Error fetching admin audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, targetModel, targetId, details } = body;

    await connectToDatabase();

    const fullName = `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || adminUser.email;

    const log = await AuditLog.create({
      adminId: (adminUser.id || (adminUser as any)._id),
      adminEmail: adminUser.email,
      adminName: fullName,
      action: action || 'ADMIN_ACTION',
      targetModel: targetModel || 'System',
      targetId: targetId || '',
      details: details || 'Admin operation performed.',
      ipAddress: '127.0.0.1',
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ error: 'Failed to record audit log' }, { status: 500 });
  }
}
