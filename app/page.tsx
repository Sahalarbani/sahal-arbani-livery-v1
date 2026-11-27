import React from 'react';
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
      {/* Mobile: judul 40px (bukan 48px) dan padding atas lebih kecil supaya
          layar HP tidak terasa sumpek; skala naik bertahap ke desktop. */}
      <div className="relative z-10 pt-28 sm:pt-32 pb-4 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        {/* Judul */}
        <h1 className="text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-5 sm:mb-6 tracking-tight uppercase">
          SAHAL ARBANI <br />
          <span className="text-brand-paper italic font-serif opacity-80">
            LIVERIES
          </span>
        </h1>

        {/* &nbsp; di sekitar span aksen: spasi harus terbaca oleh screen
            reader / copy-paste, bukan hanya terlihat di layar. */}
        <p className="text-base sm:text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          The official source for&nbsp;
          <span className="text-brand-accent">SAHAL ARBANI</span>
          &nbsp;Truckers of Europe 3 (TOE3) skins.
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
