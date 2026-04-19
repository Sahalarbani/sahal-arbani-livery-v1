/**
 * CHANGELOG
 * Version: 2.0.0
 * Date: 2026-04-20
 * Description: Penambahan callback session untuk Edge Runtime.
 * Memetakan data dari JWT token ke object session tanpa memanggil database
 * agar kompatibel dengan Vercel Edge Network.
 */

import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return true; 
    },
    // Mapping dari JWT Token ke objek Session
    session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
} satisfies NextAuthConfig;
