"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah setuju sebelumnya
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
    // Refresh halaman agar session baru bisa tersimpan dengan benar
    window.location.reload();
  };

  if (!show) return null;

  return (
    // FLOATING GLASS BAR
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl z-[9999] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl md:flex-row">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50" />
        
        <div className="text-left flex items-start gap-4">
          <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent border border-brand-accent/20 hidden md:block">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-950">
              System Authorization Required
            </h3>
            <p className="max-w-xl text-xs font-medium leading-relaxed text-zinc-600">
              This interface requires local storage access to maintain encrypted session tokens. 
              Declining may cause immediate session termination during asset deployment.
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto flex-shrink-0">
          <button 
            onClick={acceptCookies}
            className="flex-grow rounded-full bg-zinc-950 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-cyan active:scale-95 md:flex-none"
          >
            Authorize Access
          </button>
        </div>
      </div>
    </div>
  );
}
