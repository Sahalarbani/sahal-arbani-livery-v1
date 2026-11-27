"use client";

import React, { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import type { User } from "../types";

export type SessionUser = Pick<User, "name" | "email" | "role" | "image">;

export interface NavbarSession {
  user: SessionUser | null;
  loaded: boolean;
}

/**
 * Membaca status login client-side lewat GET /api/auth/session
 * (endpoint bawaan NextAuth).
 *
 * Sengaja TIDAK memakai useSession() dari next-auth/react: repo ini tidak
 * memasang <SessionProvider> di layout, dan useSession tanpa provider tidak
 * bisa dipakai. Fetch ini menjaga layout root tetap sync dan statis, jadi
 * homepage tetap PRERENDER dan TTFB tidak berubah.
 *
 * Bentuk respons: objek session { user: { name, email, image, role } }
 * atau null saat belum login.
 */
export function useNavbarSession(): NavbarSession {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        setUser(data && data.user ? (data.user as SessionUser) : null);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loaded };
}

interface NavbarAuthProps extends NavbarSession {
  variant: "desktop" | "mobile";
  /** Dipanggil setelah tombol ditekan, mis. untuk menutup menu mobile. */
  onNavigate?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

/** Area auth Navbar: nama + peran + tombol Keluar saat login, tombol Masuk saat belum. */
export const NavbarAuth: React.FC<NavbarAuthProps> = ({
  user,
  loaded,
  variant,
  onNavigate,
  onLogin,
  onLogout,
}) => {
  const handleLogin = () => {
    onNavigate?.();
    if (onLogin) onLogin();
    else signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleLogout = () => {
    onNavigate?.();
    if (onLogout) onLogout();
    // callbackUrl "/": setelah logout mendarat di homepage, bukan kembali
    // ke halaman saat itu (mis. /dashboard) yang lalu redirect ke login.
    else signOut({ callbackUrl: "/" });
  };

  if (!loaded) {
    // Placeholder solid (tanpa animasi) supaya layout tidak bergeser
    // saat status login masih dimuat.
    if (variant === "mobile") {
      return <div className="w-full h-11 rounded-xl bg-brand-surface" aria-hidden="true" />;
    }
    return <div className="w-24 h-10 rounded-full bg-brand-surface" aria-hidden="true" />;
  }

  if (!user) {
    if (variant === "mobile") {
      return (
        <button
          onClick={handleLogin}
          className="w-full min-h-11 bg-brand-accent text-white py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors hover:bg-brand-accent/90"
        >
          Masuk
        </button>
      );
    }
    return (
      <button
        onClick={handleLogin}
        className="group relative flex items-center gap-2 bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white px-6 py-2.5 min-h-11 rounded-full border border-brand-accent/20 transition-all duration-300 active:scale-95"
      >
        <ShieldCheck size={16} />
        <span className="font-bold uppercase text-[10px] tracking-widest">Masuk</span>
      </button>
    );
  }

  const isAdmin = user.role === "admin";

  if (variant === "mobile") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-brand-sage tracking-widest">
              {isAdmin ? "Admin" : "Pengguna"}
            </span>
            <span className="text-sm font-semibold text-white/90">{user.name}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Keluar"
          className="w-full min-h-11 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3 text-sm uppercase tracking-wider font-bold rounded-xl hover:bg-red-500 hover:text-white transition-colors"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <div className="flex flex-col items-end">
        <span className="text-[9px] uppercase font-bold text-brand-sage tracking-widest">
          {isAdmin ? "Admin" : "Pengguna"}
        </span>
        <span className="text-xs font-semibold text-white/90">{user.name}</span>
      </div>
      <button
        onClick={handleLogout}
        aria-label="Keluar"
        title="Keluar"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};
