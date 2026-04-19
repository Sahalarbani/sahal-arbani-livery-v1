"use client";

import { signIn } from "next-auth/react";
import { LogIn, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans">
      <div className="max-w-md w-full">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-accent/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="bg-brand-onyx border border-white/5 p-8 md:p-10 rounded-[40px] shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl border border-brand-accent/20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-brand-accent" size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-100 uppercase tracking-tight mb-2">Gate <span className="text-brand-accent">Control</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Authorized Access Only</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full h-14 bg-white text-black hover:bg-gray-100 transition-all rounded-full font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Verify via Google</span>
            </button>
            
            <p className="text-[10px] text-gray-600 text-center font-bold uppercase tracking-widest pt-4 opacity-50">
              System encryption active. Logins are monitored.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Sahal Arbani Livery &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
