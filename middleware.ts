/**
 * CHANGELOG
 * Version: 2.0.0
 * Date: 2026-04-20
 * Description: Implementasi Edge Middleware terintegrasi dengan JWT Session.
 * Mendekripsi token secara instan untuk mencegah FOUC dan mengamankan rute
 * dari pengguna tanpa akses admin di level edge network.
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Inisialisasi auth murni dari konfigurasi yang bebas adapter database
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // Role langsung dibaca dari token yang telah didekripsi
  const userRole = req.auth?.user?.role;
  
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
    }
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
