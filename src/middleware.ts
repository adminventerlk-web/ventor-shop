import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'ventershop_development_secret_key_change_me_in_production';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  const isAdminLoginPath = pathname === '/admin/login';
  const isAdminPath = pathname.startsWith('/admin') && !isAdminLoginPath;

  // --- ADMIN ROUTE PROTECTION (uses admin_session cookie) ---
  if (isAdminPath) {
    const adminToken = request.cookies.get('admin_session')?.value;
    if (!adminToken) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(adminToken, secret);
      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = '/admin/login';
      const response = NextResponse.redirect(url);
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // --- CUSTOMER & DASHBOARD ROUTES ---
  // Managed gracefully in client-side components to allow smooth navigation
  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
