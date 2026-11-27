"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Umpan balik navigasi instan (skill android-compose-builder: feedback
// sentuhan harus langsung terlihat, tanpa spinner fullscreen, tanpa
// pulse/glow/marquee).
//
// Masalah yang diatasi: di App Router, klik <Link> ke halaman dinamis
// menunggu RSC dari server sebelum halaman berganti, jadi halaman lama
// diam tanpa tanda apa-apa dan klik terasa tidak terdaftar. Bar ini
// muncul <100ms setelah klik link internal (listener click di document),
// lalu selesai saat pathname/searchParams benar-benar berubah.
// Bar tipis 3px warna brand-accent, lebar bertransisi (bukan pulse).
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const navigatingRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(href, window.location.origin);
      // Link ke halaman yang sama (termasuk anchor #) bukan navigasi.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      navigatingRef.current = true;
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      setVisible(true);
      setWidth(0);
      // Mulai dari 0 lalu ke 35% di frame berikutnya supaya transisi
      // CSS terlihat, bukan lompatan instan.
      requestAnimationFrame(() => setWidth(35));
      advanceTimer.current = setTimeout(() => setWidth(80), 900);
      // Pengaman: kalau navigasi gagal / dibatalkan, bar tidak menggantung.
      safetyTimer.current = setTimeout(() => {
        navigatingRef.current = false;
        setVisible(false);
        setWidth(0);
      }, 8000);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  // Navigasi selesai: pathname/searchParams berubah -> isi bar ke 100%
  // lalu sembunyikan.
  useEffect(() => {
    if (!navigatingRef.current) return;
    navigatingRef.current = false;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setWidth(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 300);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] bg-brand-accent transition-all duration-300 ease-out"
      style={{ width: `${width}%` }}
    />
  );
}
