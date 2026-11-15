import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { requireAdmin } from '@/lib/auth/auth';
import Shop from '@/models/Shop';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { EmailService } from '@/lib/services/emailService';
import {
  getAllInMemoryShops,
  getInMemoryShopById,
  updateInMemoryShopStatus,
} from '@/lib/shops/inMemoryShops';
import { getInMemoryUser, saveInMemoryUser } from '@/lib/auth/inMemoryUsers';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let shops: any[] = [];
    let stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    try {
      await connectToDatabase();
      const query: any = {};
      if (statusFilter && ['PENDING', 'APPROVED', 'REJECTED'].includes(statusFilter.toUpperCase())) {
        query.status = statusFilter.toUpperCase();
      }

      const dbShops = await Shop.find(query).sort({ createdAt: -1 });
      const allShopsCount = await Shop.find();
      
      if (dbShops && dbShops.length > 0) {
        shops = JSON.parse(JSON.stringify(dbShops));
        stats.total = allShopsCount.length;
        stats.pending = allShopsCount.filter((s) => s.status === 'PENDING').length;
        stats.approved = allShopsCount.filter((s) => s.status === 'APPROVED').length;
        stats.rejected = allShopsCount.filter((s) => s.status === 'REJECTED').length;
      }
    } catch (dbErr) {
      console.warn('Database error in /api/admin/shops GET, falling back to in-memory store:', dbErr);
    }

    // If DB is empty or failed, merge with in-memory shops
    if (shops.length === 0) {
      const memoryShops = getAllInMemoryShops();
      stats.total = memoryShops.length;
      stats.pending = memoryShops.filter((s) => s.status === 'PENDING').length;
      stats.approved = memoryShops.filter((s) => s.status === 'APPROVED').length;
      stats.rejected = memoryShops.filter((s) => s.status === 'REJECTED').length;

      shops = statusFilter
        ? memoryShops.filter((s) => s.status === statusFilter.toUpperCase())
        : memoryShops;
    }

    return NextResponse.json({
      success: true,
      shops,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching admin shops:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch shops' }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const { shopId, action, reason } = await request.json();

    if (!shopId || !action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Valid shopId and action (APPROVE/REJECT) are required' }, { status: 400 });
    }

    const newStatus: 'APPROVED' | 'REJECTED' = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    let updatedShop: any = null;

    // 1. Update in-memory registry
    const memShop = updateInMemoryShopStatus(shopId, newStatus, reason);
    if (memShop) {
      updatedShop = memShop;
      const memUser = getInMemoryUser(memShop.ownerEmail);
      if (memUser) {
        memUser.vendorStatus = newStatus;
        saveInMemoryUser(memUser);
      }
    }

    // 2. Update MongoDB if available
    try {
      await connectToDatabase();
      let shopDoc: any = null;

      if (mongoose.Types.ObjectId.isValid(shopId)) {
        shopDoc = await Shop.findById(shopId);
      } else {
        shopDoc = await Shop.findOne({ slug: shopId });
      }

      if (shopDoc) {
        shopDoc.status = newStatus;
        if (reason) shopDoc.rejectionReason = reason;
        await shopDoc.save();
        updatedShop = JSON.parse(JSON.stringify(shopDoc));

        // Update user's vendorStatus
        if (shopDoc.ownerId && mongoose.Types.ObjectId.isValid(shopDoc.ownerId)) {
          await User.findByIdAndUpdate(shopDoc.ownerId, {
            isVendor: true,
            vendorStatus: newStatus,
          });
        } else {
          await User.findOneAndUpdate(
            { email: shopDoc.ownerEmail },
            { isVendor: true, vendorStatus: newStatus }
          );
        }

        // Create Audit Log
        try {
          await AuditLog.create({
            adminId: mongoose.Types.ObjectId.isValid(admin.id) ? new mongoose.Types.ObjectId(admin.id) : undefined,
            adminEmail: admin.email,
            adminName: `${admin.firstName || 'Super'} ${admin.lastName || 'Admin'}`.trim(),
            action: action === 'APPROVE' ? 'APPROVE_SHOP' : 'REJECT_SHOP',
            targetModel: 'Shop',
            targetId: shopDoc._id.toString(),
            details: `Admin ${action.toLowerCase()}d shop ${shopDoc.shopName}${reason ? ` (Reason: ${reason})` : ''}`,
          });
        } catch (auditErr) {
          console.warn('Failed to write audit log for shop approval:', auditErr);
        }
      }
    } catch (dbErr) {
      console.warn('DB update failed in shop approval PATCH:', dbErr);
    }

    if (!updatedShop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // 3. Send email notification to shop owner
    try {
      if (newStatus === 'APPROVED') {
        await EmailService.sendShopApprovalEmail(
          updatedShop.ownerEmail,
          updatedShop.ownerName,
          updatedShop.shopName,
          updatedShop.slug
        );
      } else {
        await EmailService.sendShopRejectionEmail(
          updatedShop.ownerEmail,
          updatedShop.ownerName,
          updatedShop.shopName,
          reason
        );
      }
    } catch (emailErr) {
      console.warn('Failed to send status email to shop owner:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Shop successfully ${newStatus.toLowerCase()}`,
      shop: updatedShop,
    });
  } catch (error: any) {
    console.error('Error approving/rejecting shop:', error);
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}

