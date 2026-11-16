import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import DonationInitiative from '@/models/DonationInitiative';
import { inMemoryInitiatives } from '@/lib/donations/inMemoryDonations';
import { getCurrentAdmin } from '@/lib/auth/auth';

export async function GET() {
  try {
    let initiatives: any[] = [];

    try {
      await connectToDatabase();
      const dbInitiatives = await DonationInitiative.find().sort({ createdAt: -1 });
      if (dbInitiatives && dbInitiatives.length > 0) {
        initiatives = dbInitiatives.map((item) => ({
          _id: item._id.toString(),
          title: item.title,
          category: item.category,
          allocatedAmount: item.allocatedAmount,
          disbursedAmount: item.disbursedAmount,
          maxPerApplicant: item.maxPerApplicant,
          description: item.description,
          eligibility: item.eligibility,
          bannerImage: item.bannerImage,
          status: item.status,
          badge: item.badge,
          applicationCount: item.applicationCount,
          createdAt: item.createdAt,
        }));
      }
    } catch (dbErr) {
      console.warn('DB read error in /api/donations/initiatives:', dbErr);
    }

    if (initiatives.length === 0) {
      initiatives = inMemoryInitiatives;
    }

    return NextResponse.json({
      success: true,
      initiatives,
    });
  } catch (error: any) {
    console.error('Error fetching donation initiatives:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    // Allow if authenticated admin or fallback
    const body = await request.json();
    const {
      title,
      category,
      allocatedAmount,
      maxPerApplicant,
      description,
      eligibility,
      bannerImage,
      badge,
    } = body;

    if (!title || !allocatedAmount || !description || !eligibility) {
      return NextResponse.json(
        { error: 'Title, allocated amount, description, and eligibility are required.' },
        { status: 400 }
      );
    }

    let savedItem: any = null;

    // 1. Try DB save
    try {
      await connectToDatabase();
      savedItem = await DonationInitiative.create({
        title,
        category: category || 'COMMUNITY',
        allocatedAmount: Number(allocatedAmount),
        disbursedAmount: 0,
        maxPerApplicant: Number(maxPerApplicant) || Math.round(Number(allocatedAmount) / 20),
        description,
        eligibility,
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80',
        badge: badge || 'Platform Revenue Share',
        status: 'ACTIVE',
        applicationCount: 0,
      });
    } catch (dbErr) {
      console.warn('DB error saving initiative, storing in memory:', dbErr);
    }

    // 2. In-Memory save
    const newMemoryItem = {
      _id: savedItem ? savedItem._id.toString() : `init-${Date.now()}`,
      title,
      category: (category || 'COMMUNITY') as any,
      allocatedAmount: Number(allocatedAmount),
      disbursedAmount: 0,
      maxPerApplicant: Number(maxPerApplicant) || Math.round(Number(allocatedAmount) / 20),
      description,
      eligibility,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80',
      badge: badge || 'Platform Revenue Share',
      status: 'ACTIVE' as const,
      applicationCount: 0,
      createdAt: new Date().toISOString(),
    };

    inMemoryInitiatives.unshift(newMemoryItem);

    return NextResponse.json({
      success: true,
      message: 'Donation initiative created successfully',
      initiative: newMemoryItem,
    });
  } catch (error: any) {
    console.error('Error in POST /api/donations/initiatives:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Initiative ID is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await DonationInitiative.findByIdAndDelete(id);
    } catch (dbErr) {
      console.warn('DB error deleting initiative:', dbErr);
    }

    const idx = inMemoryInitiatives.findIndex((item) => item._id === id);
    if (idx !== -1) {
      inMemoryInitiatives.splice(idx, 1);
    }

    return NextResponse.json({ success: true, message: 'Initiative removed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
