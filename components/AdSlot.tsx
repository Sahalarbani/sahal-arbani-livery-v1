"use client";

// Komponen khusus tempat meletakkan slot iklan AdSense 
// Ini mempermudah pengguna memetakan ID iklan pada script tag standar Google Ads
import React, { useEffect, useState } from 'react';

interface AdSlotProps {
  className?: string;
  adSlotId?: string; 
  adFormat?: "auto" | "fluid" | "horizontal" | "vertical" | "rectangle";
  fullWidthResponsive?: boolean;
}

export function AdSlot({ 
  className = "", 
  adSlotId = "XXXXXX", 
  adFormat = "auto",
  fullWidthResponsive = true,
  publisherId
}: AdSlotProps & { publisherId?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const pushedRef = React.useRef(false);
  const isReal = publisherId && adSlotId && adSlotId !== "XXXXXX";

  // Phase 1: Ensure we are on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Phase 2: Once mounted and isReal is confirmed, trigger the push
  useEffect(() => {
    if (isMounted && isReal && !pushedRef.current) {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }
  }, [isMounted, isReal]);

  return (
    <div className={`relative my-6 flex min-h-[100px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/10 bg-brand-onyx transition-all ${className}`}>
      {isReal && isMounted ? (
        <ins className="adsbygoogle"
             style={{ display: "block", width: "100%", height: "100%", minHeight: "100px" }}
             data-ad-client={publisherId}
             data-ad-slot={adSlotId}
             data-ad-format={adFormat}
             data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
             suppressHydrationWarning
        />
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(9,9,11,0.03),transparent)]" />
          <div className="z-10 text-center py-6 px-4">
            <span className="inline-block px-3 py-1 bg-brand-accent/20 text-brand-accent border border-brand-accent/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
              Sponsor / Advertisement
            </span>
            <p className="max-w-sm text-xs font-medium text-zinc-500">
              Ruang iklan AdSense. Slot ID: <code className="rounded bg-brand-onyx/10 px-1 font-mono text-zinc-300">{adSlotId}</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
