"use client";

import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    if (window.opener) {
      // Send message to opener window
      window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*");
      window.close();
    } else {
      // If opened directly (not in a popup), fallback to dashboard
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8 text-center text-brand-sage">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-sage/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-medium tracking-widest uppercase text-sm">Authentication Successful!</p>
        <p className="text-xs text-zinc-500">You can close this window now.</p>
      </div>
    </div>
  );
}
