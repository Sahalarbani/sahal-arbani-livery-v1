import NextAuth, { DefaultSession } from "next-auth";

// 🔥 INI KODE SAKTINYA: Kita inject 'role' ke dalam NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

// JWT lives in @auth/core/jwt; "next-auth/jwt" hanya me-re-export tipe ini,
// jadi augmentasi harus menarget modul aslinya agar token.id / token.role
// di callback jwt (auth.ts) lolos pengecekan tipe. Tanpa ini, TypeScript
// menganggap JWT tidak punya properti id/role dan build gagal.
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

// --- Batas Kode Baru (Biarkan kode lama di bawah ini tetap ada) ---


export interface Skin {
  id: string;
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
  category: string; // Prisma returns string, looser type helps compatibility
  author: string; // mapped from authorName
  downloads: number;
  createdAt: string | Date; // Allow Date objects from Prisma
  published?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
