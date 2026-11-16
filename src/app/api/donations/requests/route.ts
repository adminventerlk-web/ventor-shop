import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import DonationRequest from '@/models/DonationRequest';
import DonationInitiative from '@/models/DonationInitiative';
import { inMemoryRequests, inMemoryInitiatives } from '@/lib/donations/inMemoryDonations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let requests: any[] = [];

    try {
      await connectToDatabase();
      const query: any = {};
      if (status && status !== 'ALL') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { applicantName: { $regex: search, $options: 'i' } },
          { requestId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const dbRequests = await DonationRequest.find(query).sort({ createdAt: -1 });
      if (dbRequests && dbRequests.length > 0) {
        requests = dbRequests.map((req) => ({
          _id: req._id.toString(),
          requestId: req.requestId,
          initiativeId: req.initiativeId,
          initiativeTitle: req.initiativeTitle,
          applicantName: req.applicantName,
          email: req.email,
          phone: req.phone,
          nicOrId: req.nicOrId,
          city: req.city,
          province: req.province,
          requestedAmount: req.requestedAmount,
          reason: req.reason,
          supportingInfo: req.supportingInfo,
          status: req.status,
          adminNotes: req.adminNotes,
          createdAt: req.createdAt,
        }));
      }
    } catch (dbErr) {
      console.warn('DB error in /api/donations/requests GET:', dbErr);
    }

    if (requests.length === 0) {
      let filtered = [...inMemoryRequests];
      if (status && status !== 'ALL') {
        filtered = filtered.filter((r) => r.status === status);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.applicantName.toLowerCase().includes(s) ||
            r.requestId.toLowerCase().includes(s) ||
            r.phone.includes(s) ||
            r.email.toLowerCase().includes(s)
        );
      }
      requests = filtered;
    }

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error: any) {
    console.error('Error fetching donation requests:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      initiativeId,
      initiativeTitle,
      applicantName,
      email,
      phone,
      nicOrId,
      city,
      province,
      requestedAmount,
      reason,
      supportingInfo,
    } = body;

    if (!applicantName || !phone || !nicOrId || !reason || !requestedAmount) {
      return NextResponse.json(
        { error: 'Please fill in all required fields: Name, Phone, NIC/ID, Amount, and Reason.' },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const requestId = `AID-${new Date().getFullYear()}-${randomSuffix}`;

    let savedDbRequest: any = null;

    try {
      await connectToDatabase();
      savedDbRequest = await DonationRequest.create({
        requestId,
        initiativeId: initiativeId || 'general',
        initiativeTitle: initiativeTitle || 'General Community Aid',
        applicantName,
        email: email || '',
        phone,
        nicOrId,
        city: city || 'Sri Lanka',
        province: province || '',
        requestedAmount: Number(requestedAmount),
        reason,
        supportingInfo: supportingInfo || '',
        status: 'PENDING',
        adminNotes: '',
      });

      // Increment applicationCount in initiative if exists
      if (initiativeId) {
        await DonationInitiative.findByIdAndUpdate(initiativeId, {
          $inc: { applicationCount: 1 },
        });
      }
    } catch (dbErr) {
      console.warn('DB error saving donation request, fallback to in-memory:', dbErr);
    }

    // Save in memory
    const newMemoryRequest = {
      _id: savedDbRequest ? savedDbRequest._id.toString() : `req-${Date.now()}`,
      requestId,
      initiativeId: initiativeId || 'general',
      initiativeTitle: initiativeTitle || 'General Community Aid',
      applicantName,
      email: email || '',
      phone,
      nicOrId,
      city: city || 'Sri Lanka',
      province: province || '',
      requestedAmount: Number(requestedAmount),
      reason,
      supportingInfo: supportingInfo || '',
      status: 'PENDING' as const,
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };

    inMemoryRequests.unshift(newMemoryRequest);

    // Update in-memory initiative count
    const targetInit = inMemoryInitiatives.find((i) => i._id === initiativeId);
    if (targetInit) {
      targetInit.applicationCount = (targetInit.applicationCount || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      message: 'Your assistance request has been submitted to Super Admin successfully!',
      requestId,
    });
  } catch (error: any) {
    console.error('Error submitting donation request:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REJECTED'];
    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Valid id and status are required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await DonationRequest.findByIdAndUpdate(id, {
        $set: {
          status,
          ...(adminNotes !== undefined ? { adminNotes } : {}),
        },
      });
    } catch (dbErr) {
      console.warn('DB error in /api/donations/requests PATCH:', dbErr);
    }

    // Update in-memory
    const memReq = inMemoryRequests.find((r) => r._id === id || r.requestId === id);
    if (memReq) {
      memReq.status = status;
      if (adminNotes !== undefined) {
        memReq.adminNotes = adminNotes;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Request status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('Error updating donation request status:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
