/**
 * CHANGELOG
 * Version: 2.0.0
 * Date: 2026-04-20
 * Description: Migrasi arsitektur dari Database Session ke JWT Session.
 * Memindahkan logika auto-promote ke dalam callback JWT untuk efisiensi koneksi Prisma.
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config"; 

// SEC1: AUTH_SECRET wajib dari environment. Jangan pernah pakai fallback
// hardcode — secret yang tertulis di repo publik bisa dipakai siapa pun
// untuk menempa sesi JWT admin. Gagal start dengan pesan jelas kalau kosong.
if (!process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET is not set. Set a random secret (min. 32 characters) in the Vercel environment variables."
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    deleteSession: async (sessionToken) => {
      try {
        return await prisma.session.delete({ where: { sessionToken } });
      } catch (e: any) {
        if (e.code === "P2025") return null;
        throw e;
      }
    },
  } as any,
  session: { strategy: "jwt" }, // Perubahan arsitektur ke JWT
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: `__Secure-authjs.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
    callbackUrl: {
      name: `__Secure-authjs.callback-url`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
    csrfToken: {
      name: `__Host-authjs.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
    pkceCodeVerifier: {
      name: `__Secure-authjs.pkce.code_verifier`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true, maxAge: 900 },
    },
    state: {
      name: `__Secure-authjs.state`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true, maxAge: 900 },
    },
    nonce: {
      name: `__Secure-authjs.nonce`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    // Callback JWT hanya dieksekusi saat pembuatan/pembaruan token (Node.js layer)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
        
        if (user.email && adminEmails.includes(user.email) && token.role !== "admin") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" }
          });
          token.role = "admin";
        }
      }
      return token;
    },
  },
});

