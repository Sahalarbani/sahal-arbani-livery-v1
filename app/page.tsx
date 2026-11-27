import React from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { getCategories, getSkins } from '@/services/skin.service';
import { AdSlot } from '@/components/AdSlot';
import { SkinGallery } from '@/components/SkinGallery';
import { getAdSettings } from '@/lib/actions/ads';

// Optimasi cache (branch optimasi-cache):
// - Homepage dibuat statis / ISR: revalidate 3600 + force-static.
// - Tampilan default dirender statis. Pencarian (q) dan filter kategori
//   dipindah ke komponen client SkinGallery supaya tidak memaksa halaman
//   menjadi dinamis (membaca searchParams di server membuat
//   X-Vercel-Cache selalu MISS) dan TTFB tetap 0.42-0.66 detik.
// - Pengambilan data dibungkus try/catch supaya prerender statis tidak
//   gagal total kalau database tidak tersedia saat build.
export const revalidate = 3600; // ISR: regen maksimal 1x per jam
export const dynamic = "force-static";

export default async function HomePage() {
  let allCategories: string[] = ['ALL'];
  let skins: any[] = [];
  let adSettings: any = null;
  try {
    const [cats, skinList, ads] = await Promise.all([
      getCategories(),
      getSkins('', 'ALL'),
      getAdSettings()
    ]);
    allCategories = cats;
    skins = skinList;
    adSettings = ads;
  } catch (error) {
    console.error('Failed to load homepage data, rendering empty state:', error);
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-dark">
      {/* HERO SECTION */}
      <div className="relative z-10 pt-32 pb-4 px-6 text-center max-w-5xl mx-auto">
        {/* Version Badge - Minimalist Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-onyx border border-white/5 mb-8">
          <Zap size={14} className="text-brand-sage fill-brand-sage" />
          <span className="text-[11px] font-semibold text-brand-sage uppercase tracking-[0.2em]">
            System V2.0 Online
          </span>
        </div>

        {/* Minimalist Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6 tracking-tight uppercase">
          SAHAL ARBANI <br />
          <span className="text-brand-paper italic font-serif opacity-80">
            LIVERIES
          </span>
        </h1>

        {/* B7: spasi eksplisit sebelum span supaya tidak menempel ("forSAHAL ARBANI") */}
        <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          The official source for{" "}
          <span className="text-brand-accent">SAHAL ARBANI</span>{" "}
          Truckers of Europe 3 (TOE3) skins.
          <br className="hidden md:block" /> Follow the evolution on TikTok: <Link href="https://www.tiktok.com/@sahal.arbani" target="_blank" className="text-white hover:text-brand-accent transition-colors">@sahal.arbani</Link>
        </p>

        {/* TOP AD SENSE PLACEMENT - disembunyikan AdSlot kalau tidak ada iklan nyata (B5) */}
        <AdSlot
          publisherId={adSettings?.publisherId}
          adSlotId={adSettings?.slotHome || "HOMEPAGE-TOP-728x90"}
        />
      </div>

      <SkinGallery skins={skins} categories={allCategories} />
    </div>
  );
}
