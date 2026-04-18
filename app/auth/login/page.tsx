"use client";

import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function LoginPopup() {
  const triggered = useRef(false);

  useEffect(() => {
    if (!triggered.current) {
      triggered.current = true;
      signIn("google", { callbackUrl: "/auth/success" });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark text-brand-accent p-8">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75" strokeLinecap="round" />
        </svg>
        <p className="font-medium tracking-widest uppercase text-sm">Transferring to Google...</p>
      </div>
    </div>
  );
}
