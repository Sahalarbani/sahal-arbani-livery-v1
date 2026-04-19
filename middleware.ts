/**
 * CHANGELOG
 * Version: 1.0.0
 * Date: 2026-04-20
 * Description: Implementasi Edge Middleware untuk proteksi rute dinamis.
 * Mencegah FOUC (Flash of Unauthenticated Content) dengan memvalidasi sesi 
 * dan peran pengguna (RBAC) di level Edge network sebelum rendering komponen UI.
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Menginisialisasi modul autentikasi tanpa adapter database agar kompatibel di Edge Runtime
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

  // Proteksi khusus untuk rute /dashboard
  if (isDashboardRoute) {
    // 1. Jika pengguna belum login, arahkan ke halaman masuk
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
    }
    
    // 2. Jika pengguna sudah login tapi bukan admin, kembalikan ke beranda
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }
  
  // Biarkan permintaan lain lewat secara normal
  return NextResponse.next();
});

// Konfigurasi Matcher untuk membatasi eksekusi Middleware guna menghemat komputasi
export const config = {
  matcher: [
    // Jalankan middleware ini di seluruh rute kecuali aset statis dan API internal Next.js
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
