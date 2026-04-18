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
    <div className={`w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center min-h-[100px] my-6 transition-all relative group ${className}`}>
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
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
          <div className="z-10 text-center py-6 px-4">
            <span className="inline-block px-3 py-1 bg-brand-accent/20 text-brand-accent border border-brand-accent/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
              Sponsor / Advertisement
            </span>
            <p className="text-xs text-gray-500 font-medium max-w-sm">
              Ruang iklan AdSense. Slot ID: <code className="text-gray-300 font-mono bg-black/30 px-1 rounded">{adSlotId}</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
