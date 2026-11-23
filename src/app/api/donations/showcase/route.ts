import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import DonationShowcase from '@/models/DonationShowcase';
import {
  getInMemoryDonations,
  saveInMemoryDonation,
  deleteInMemoryDonation,
  InMemoryDonationRecord,
} from '@/lib/donations/inMemoryShowcase';

export async function GET() {
  try {
    let records: any[] = [];

    try {
      await connectToDatabase();
      const dbRecords = await DonationShowcase.find().sort({ createdAt: -1 });
      if (dbRecords && dbRecords.length > 0) {
        records = JSON.parse(JSON.stringify(dbRecords));
      }
    } catch (dbErr) {
      console.warn('DB read error in /api/donations/showcase, using in-memory store:', dbErr);
    }

    if (records.length === 0) {
      records = getInMemoryDonations();
    }

    const totalDonated = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const totalCauses = records.length;

    return NextResponse.json({
      success: true,
      records,
      stats: {
        totalDonated,
        totalCauses,
        beneficiariesCount: '500+ Individuals & Families',
      },
    });
  } catch (error: any) {
    console.error('Error fetching donation showcase:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch donations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      amount,
      category,
      beneficiary,
      location,
      date,
      description,
      imageUrl,
      badge,
    } = body;

    if (!title || !amount || !beneficiary) {
      return NextResponse.json(
        { error: 'Title (Cause), Amount, and Beneficiary are required.' },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Please enter a valid donation amount in LKR.' },
        { status: 400 }
      );
    }

    let savedRecord: any = null;

    try {
      await connectToDatabase();
      savedRecord = await DonationShowcase.create({
        title: title.trim(),
        amount: parsedAmount,
        category: category || 'COMMUNITY',
        beneficiary: beneficiary.trim(),
        location: (location || 'Sri Lanka').trim(),
        date: (date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })).trim(),
        description: (description || 'Community welfare contribution supported directly by VENTERPRISE platform revenue.').trim(),
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80',
        badge: badge || 'Platform Revenue Share • 100% Funded',
        status: 'COMPLETED',
        featured: true,
      });
    } catch (dbErr) {
      console.warn('DB write error in /api/donations/showcase, saving to in-memory store:', dbErr);
    }

    const memoryRecord: InMemoryDonationRecord = {
      _id: savedRecord ? savedRecord._id.toString() : `don-${Date.now()}`,
      title: title.trim(),
      amount: parsedAmount,
      category: category || 'COMMUNITY',
      beneficiary: beneficiary.trim(),
      location: (location || 'Sri Lanka').trim(),
      date: (date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })).trim(),
      description: (description || 'Community welfare contribution supported directly by VENTERPRISE platform revenue.').trim(),
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80',
      badge: badge || 'Platform Revenue Share • 100% Funded',
      status: 'COMPLETED',
      featured: true,
      createdAt: new Date().toISOString(),
    };

    saveInMemoryDonation(memoryRecord);

    return NextResponse.json({
      success: true,
      message: 'Donation record added successfully!',
      record: savedRecord ? JSON.parse(JSON.stringify(savedRecord)) : memoryRecord,
    });
  } catch (error: any) {
    console.error('Error recording donation:', error);
    return NextResponse.json({ error: error.message || 'Failed to record donation' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing donation ID or updates' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await DonationShowcase.findByIdAndUpdate(id, updates, { new: true });
    } catch (dbErr) {
      console.warn('DB error in PATCH /api/donations/showcase:', dbErr);
    }

    const memoryList = getInMemoryDonations();
    const target = memoryList.find((r) => r._id === id);
    if (target) {
      Object.assign(target, updates);
    }

    return NextResponse.json({ success: true, message: 'Donation record updated successfully!' });
  } catch (error: any) {
    console.error('Error updating donation record:', error);
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing donation ID' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await DonationShowcase.findByIdAndDelete(id);
    } catch (dbErr) {
      console.warn('DB error in DELETE /api/donations/showcase:', dbErr);
    }

    deleteInMemoryDonation(id);

    return NextResponse.json({ success: true, message: 'Donation record deleted' });
  } catch (error: any) {
    console.error('Error deleting donation:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 });
  }
}
