"use client";

import React, { useState } from 'react';
import { User } from '../types';
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';

interface NavbarProps {
  user: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: any;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, icon: Icon }) => (
  <Link 
    href={href} 
    className="group relative flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
  >
    {Icon && <Icon size={14} className="text-brand-cyan group-hover:scale-110 transition-transform" />}
    <span className="relative z-10">{children}</span>
  </Link>
);

export const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    if (onLogin) onLogin();
    else signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else signOut();
  };

  return (
    <nav className="fixed left-0 top-0 z-[100] w-full">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="glass-panel flex h-16 items-center justify-between rounded-[22px] px-3 sm:px-4">
          
          {/* LOGO AREA */}
          <Link href="/" className="group relative flex flex-shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-brand-cyan shadow-halo">
              <Sparkles size={18} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-black uppercase tracking-[0.12em] text-white sm:text-base">Sahal Arbani</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-accent">Livery Hub</span>
            </span>
          </Link>

          {/* DESKTOP MENU - PILL SHAPE */}
          <div className="hidden md:block">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/blog">Insight</NavLink>
              <NavLink href="/#about">About</NavLink>
              {user?.role === 'admin' && (
                <NavLink href="/dashboard" icon={LayoutDashboard}>
                  Dashboard
                </NavLink>
              )}
            </div>
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-bold text-brand-sage tracking-widest">Active</span>
                  <span className="text-xs font-semibold text-white/90">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="rounded-full border border-red-400/20 bg-red-500/10 p-2.5 text-red-300 transition-all duration-300 hover:bg-red-500/20"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="group relative flex items-center gap-2 rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-5 py-2.5 text-brand-cyan transition-all duration-300 hover:bg-brand-cyan hover:text-brand-dark active:scale-95"
              >
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Login</span>
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full border border-white/10 bg-white/10 p-2 text-white transition-all hover:bg-white/15 active:scale-90"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="glass-panel absolute left-4 right-4 top-24 overflow-hidden rounded-[22px] md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-4 space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10">Home</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10">Insight</Link>
            <Link href="/#about" onClick={() => setIsOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10">About</Link>
            
            {user?.role === 'admin' && (
               <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block rounded-2xl bg-brand-cyan/10 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-brand-cyan">
                 Admin Dashboard
               </Link>
            )}
            
            <div className="h-px bg-white/5 my-2" />
            
            <div className="pt-2">
               {user ? (
                 <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-3 text-sm font-bold uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500 hover:text-white">
                   <LogOut size={16} /> Logout
                 </button>
               ) : (
                 <button onClick={handleLogin} className="w-full rounded-2xl bg-brand-cyan py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cyan/90">
                   Login
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
