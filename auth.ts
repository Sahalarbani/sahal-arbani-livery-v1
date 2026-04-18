import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config"; 

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    deleteSession: async (sessionToken) => {
      try {
        return await prisma.session.delete({ where: { sessionToken } });
      } catch (e: any) {
        // Handle "Record to delete does not exist." gracefully (P2025 code)
        if (e.code === "P2025") return null;
        throw e;
      }
    },
  } as any,
  session: { strategy: "database" },
  trustHost: true,
  secret: process.env.AUTH_SECRET || "sahal-arbani-livery-secret-key-that-is-at-least-32-chars",
  ...authConfig,
  // 👇 Secure cross-origin cookies for iframe support
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: `__Secure-authjs.session-token`,
      options: { httpOnly: true, sameSite: "none", path: "/", secure: true },
    },
    callbackUrl: {
      name: `__Secure-authjs.callback-url`,
      options: { httpOnly: true, sameSite: "none", path: "/", secure: true },
    },
    csrfToken: {
      name: `__Host-authjs.csrf-token`,
      options: { httpOnly: true, sameSite: "none", path: "/", secure: true },
    },
    pkceCodeVerifier: {
      name: `__Secure-authjs.pkce.code_verifier`,
      options: { httpOnly: true, sameSite: "none", path: "/", secure: true, maxAge: 900 },
    },
    state: {
      name: `__Secure-authjs.state`,
      options: { httpOnly: true, sameSite: "none", path: "/", secure: true, maxAge: 900 },
    },
    nonce: {
      name: `__Secure-authjs.nonce`,
      options: { httpOnly: true, sameSite: "none", path: "/", secure: true },
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user }: any) {
      if (session.user && user) {
        session.user.id = user.id;
        
        // AUTO-PROMOTE: Promosikan email owner secara otomatis saat login
        if (user.email === "sahalpanglima@gmail.com" && user.role !== "admin") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" }
          });
          user.role = "admin";
        }

        session.user.role = user.role;
      }
      return session;
    },
  },
});
