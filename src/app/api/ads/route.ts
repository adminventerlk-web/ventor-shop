import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Ad from '@/models/Ad';

export async function GET() {
  try {
    await connectToDatabase();
    const ads = await Ad.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ads: ads || [] });
  } catch (err: any) {
    console.error('Error in /api/ads GET:', err);
    return NextResponse.json({ ads: [] }, { status: 200 });
  }
}
