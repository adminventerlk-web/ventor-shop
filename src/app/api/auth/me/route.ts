import { NextResponse } from 'next/server';
import { getCurrentCustomer, getCurrentUser } from '@/lib/auth/auth';

export async function GET() {
  try {
    const admin = await getCurrentUser();
    if (admin && (admin.role === 'ADMIN' || admin.role === 'SUPER_ADMIN')) {
      return NextResponse.json({ user: admin });
    }
    const customer = await getCurrentCustomer();
    if (customer) {
      return NextResponse.json({ user: customer });
    }
    return NextResponse.json({ user: admin || null });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ user: null });
  }
}
