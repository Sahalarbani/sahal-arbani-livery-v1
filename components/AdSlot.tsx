"use client";

// Komponen khusus tempat meletakkan slot iklan AdSense.
// B5 (skill: no dummy data, no placeholder kosong): kalau tidak ada
// iklan nyata (publisher/slot tidak valid atau AdSense tidak aktif),
// komponen ini TIDAK merender apa pun — jangan tampilkan kotak
// placeholder besar yang terlihat seperti area rusak.
import React, { useEffect, useState } from 'react';

interface AdSlotProps {
  className?: string;
  adSlotId?: string;
  adFormat?: "auto" | "fluid" | "horizontal" | "vertical" | "rectangle";
  fullWidthResponsive?: boolean;
  isAdsActive?: boolean;
}

export function AdSlot({
  className = "",
  adSlotId = "XXXXXX",
  adFormat = "auto",
  fullWidthResponsive = true,
  publisherId,
  isAdsActive = true,
}: AdSlotProps & { publisherId?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const pushedRef = React.useRef(false);

  // Slot AdSense asli berupa angka; ID placeholder seperti
  // "HOMEPAGE-TOP-728x90" atau "TOP-HOME-ARTICLES" bukan slot nyata.
  const isRealSlot = /^\d{5,}$/.test(adSlotId);
  const isRealPublisher =
    !!publisherId &&
    publisherId.startsWith("ca-pub-") &&
    !publisherId.includes("XXXX");
  const isReal = isMounted && isRealSlot && isRealPublisher && isAdsActive;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isReal && !pushedRef.current) {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }
  }, [isReal]);

  if (!isReal) return null;

  return (
    <div className={`w-full my-6 ${className}`}>
      <ins className="adsbygoogle"
           style={{ display: "block", width: "100%", minHeight: "100px" }}
           data-ad-client={publisherId}
           data-ad-slot={adSlotId}
           data-ad-format={adFormat}
           data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
           suppressHydrationWarning
      />
    </div>
  );
}
