"use client";

import React, { useState } from 'react';
import { User } from '../types';
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
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
    className="group relative flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-all duration-300 rounded-full hover:bg-white/5 uppercase tracking-widest"
  >
    {Icon && <Icon size={14} className="text-brand-accent group-hover:scale-110 transition-transform" />}
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
    <nav className="fixed w-full z-[100] top-0 left-0 border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO AREA */}
          <Link href="/" className="flex-shrink-0 cursor-pointer group relative">
            <h1 className="relative text-lg md:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
              SAHAL ARBANI <span className="text-brand-accent text-sm md:text-lg">/ LIVERY</span>
            </h1>
          </Link>

          {/* DESKTOP MENU - PILL SHAPE */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-1 bg-brand-onyx p-1.5 rounded-full border border-white/5">
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
                  className="p-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="group relative flex items-center gap-2 bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white px-6 py-2.5 rounded-full border border-brand-accent/20 transition-all duration-300 active:scale-95"
              >
                <ShieldCheck size={16} className="group-hover:animate-bounce" />
                <span className="font-bold uppercase text-[10px] tracking-widest">Authenticate</span>
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-brand-onyx text-white hover:bg-white/10 active:scale-90 transition-all"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-brand-onyx border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-4 space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/5 transition-colors">Home</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/5 transition-colors">Insight</Link>
            <Link href="/#about" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/5 transition-colors">About</Link>
            
            {user?.role === 'admin' && (
               <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-brand-accent bg-brand-accent/5">
                 Admin Dashboard
               </Link>
            )}
            
            <div className="h-px bg-white/5 my-2" />
            
            <div className="pt-2">
               {user ? (
                 <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3 text-sm uppercase tracking-wider font-bold rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                   <LogOut size={16} /> Logout
                 </button>
               ) : (
                 <button onClick={handleLogin} className="w-full bg-brand-accent text-white py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors hover:bg-brand-accent/90">
                   Access System
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
