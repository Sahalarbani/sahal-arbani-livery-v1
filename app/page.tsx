import React from 'react';
import { SkinCard } from '@/components/SkinCard';
import { Search, Zap, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { getCategories, getSkins } from '@/services/skin.service';
import { AdSlot } from '@/components/AdSlot';
import { getAdSettings } from '@/lib/actions/ads';

// ✅ Caching Strategy: Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds instead of force-dynamic

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q || '';
  const categoryFilter = resolvedSearchParams?.category || 'ALL';

  // 1️⃣ LOGIKA DINAMIS: Dipisah ke Service (SoC)
  // Fetch data secara parallel untuk performa
  const [allCategories, skins, adSettings] = await Promise.all([
    getCategories(),
    getSkins(query, categoryFilter),
    getAdSettings()
  ]);

  // 3️⃣ RETURN UI (REFACTORED TO MINIMALIST iOS 26 STYLE)
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

        <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          The official source for <span className="text-brand-accent">SAHAL ARBANI</span> Truckers of Europe 3 (TOE3) skins. 
          <br className="hidden md:block"/> Follow the evolution on TikTok: <Link href="https://www.tiktok.com/@sahal.arbani" target="_blank" className="text-white hover:text-brand-accent transition-colors">@sahal.arbani</Link>
        </p>

        {/* CLEAN SEARCH PILL */}
        <div className="max-w-xl mx-auto relative group mb-8">
          <form action="/" method="GET" className="relative flex items-center">
            <div className="absolute left-5 text-gray-500 group-focus-within:text-brand-accent transition-colors">
              <Search size={22} />
            </div>
            
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search TOE3 skins / liveries..."
              className="w-full bg-brand-onyx focus:bg-brand-onyx border border-white/5 focus:border-brand-accent/50 rounded-full py-4 pl-14 pr-6 text-gray-200 placeholder-gray-500 tracking-wide outline-none transition-all duration-300 shadow-sm"
            />
          </form>
        </div>

        {/* TOP AD SENSE PLACEMENT */}
        <AdSlot 
          publisherId={adSettings?.publisherId} 
          adSlotId={adSettings?.slotHome || "HOMEPAGE-TOP-728x90"} 
        />
      </div>

      {/* CONTENT SECTION (Bento Grid Style) */}
      <div id="gallery" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        
        {/* SEPARATOR */}
        <div className="flex items-center justify-center gap-4 mb-10 opacity-40">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-500" />
          <LayoutGrid size={14} className="text-gray-400" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-500" />
        </div>

        {/* CAPSULE TABS FILTERS */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {allCategories.map((cat) => {
            const isActive = categoryFilter.toUpperCase() === cat.toUpperCase();
            return (
              <Link
                key={cat}
                href={`/?category=${cat === 'ALL' ? '' : cat}&q=${query}`}
                className={`
                  relative px-5 py-2 rounded-full font-semibold text-[11px] uppercase tracking-wider transition-all duration-300
                  ${isActive 
                    ? 'bg-brand-accent text-brand-dark shadow-sm scale-[1.02]' 
                    : 'bg-brand-onyx text-gray-400 border border-transparent hover:bg-brand-onyx/80 hover:text-gray-200'
                  }
                `}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* GRID LAYOUT (Bento) */}
        {skins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-brand-onyx rounded-[24px] border border-white/5 border-dashed">
            <Search size={40} className="text-gray-600 mb-4 opacity-50" />
            <p className="text-lg font-semibold text-gray-400 uppercase tracking-wide">No Data Found</p>
            <p className="text-gray-500 mt-1 text-sm">Try adjusting your search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skins.map(skin => (
              <SkinCard 
                key={skin.id} 
                skin={skin as any} 
                href={`/skin/${skin.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
