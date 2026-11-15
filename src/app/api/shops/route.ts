import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Shop from '@/models/Shop';
import { getAllInMemoryShops } from '@/lib/shops/inMemoryShops';

export async function GET() {
  try {
    let approvedShops: any[] = [];

    try {
      await connectToDatabase();
      const dbShops = await Shop.find({ status: 'APPROVED' }).sort({ createdAt: -1 });
      if (dbShops && dbShops.length > 0) {
        approvedShops = JSON.parse(JSON.stringify(dbShops));
      }
    } catch (dbErr) {
      console.warn('DB offline in /api/shops GET, using in-memory shops:', dbErr);
    }

    if (approvedShops.length === 0) {
      approvedShops = getAllInMemoryShops().filter((s) => s.status === 'APPROVED');
    }

    return NextResponse.json({
      success: true,
      shops: approvedShops,
    });
  } catch (error: any) {
    console.error('Error fetching approved shops:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

