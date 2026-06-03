import React from 'react';
import { SkinCard } from '@/components/SkinCard';
import { Search, Zap, LayoutGrid, ArrowDown, Sparkles, Download } from 'lucide-react';
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-12 pt-32 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-16 lg:pt-36">
        <div className="flex flex-col justify-center">
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm">
            <Zap size={14} className="text-brand-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              TOE3 Livery Studio 2026
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            SAHAL ARBANI
            <span className="mt-2 block font-display text-brand-cyan">
              LIVERY
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
            Download skin dan livery Truckers of Europe 3 dengan preview yang rapi, kategori jelas, dan asset pilihan dari Sahal Arbani.
            <Link href="https://www.tiktok.com/@sahal.arbani" target="_blank" className="ml-1 font-semibold text-brand-cyan transition-colors hover:text-zinc-950">@sahal.arbani</Link>
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#gallery" className="primary-button">
              Browse Skins <ArrowDown size={16} />
            </Link>
            <Link href="/blog" className="ios-button inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em]">
              Read Guides <Sparkles size={16} />
            </Link>
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[28px] p-3">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-zinc-950/20 to-transparent" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-zinc-100">
            {skins[0]?.image ? (
              <img src={skins[0].image} alt={skins[0].title || 'Featured livery'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(114,230,255,0.18),rgba(255,184,108,0.12)),#11151B]">
                <LayoutGrid className="text-brand-cyan" size={56} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/78 via-zinc-950/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-cyan">Featured Asset</p>
                <h2 className="mt-1 line-clamp-2 text-2xl font-black leading-tight text-white">{skins[0]?.title || 'TOE3 HD Livery'}</h2>
              </div>
              <div className="hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-right shadow-sm backdrop-blur-xl sm:block">
                <p className="text-2xl font-black text-zinc-950">{skins.length}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">Assets</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3">
            {skins.slice(0, 3).map((skin) => (
              <div key={skin.id} className="hairline-panel flex items-center gap-2 rounded-2xl p-2">
                <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  {skin.image && <img src={skin.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wide text-zinc-950">{skin.category}</p>
                  <p className="flex items-center gap-1 text-[10px] text-zinc-500"><Download size={10} /> {(skin.downloads || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <form action="/" method="GET" className="glass-panel relative flex items-center rounded-full p-2">
          <Search size={20} className="ml-4 text-brand-cyan" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search TOE3 skins, livery, truck type..."
            className="w-full bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-zinc-950 outline-none placeholder:text-zinc-400"
          />
        </form>
        <AdSlot
          publisherId={adSettings?.publisherId}
          adSlotId={adSettings?.slotHome || "HOMEPAGE-TOP-728x90"}
          className="mt-8"
        />
      </div>

      {/* CONTENT SECTION (Bento Grid Style) */}
      <div id="gallery" className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">

        {/* SEPARATOR */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 sm:text-3xl">Latest Liveries</h2>
            <p className="mt-2 text-sm text-zinc-500">Pilih kategori atau cari asset TOE3 favoritmu.</p>
          </div>
          <div className="hidden items-center gap-3 text-zinc-500 sm:flex">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-300" />
            <LayoutGrid size={16} />
          </div>
        </div>

        {/* CAPSULE TABS FILTERS */}
        <div className="mb-10 flex flex-wrap gap-2 rounded-[22px] border border-zinc-200 bg-white p-2 shadow-sm">
          {allCategories.map((cat) => {
            const isActive = categoryFilter.toUpperCase() === cat.toUpperCase();
            return (
              <Link
                key={cat}
                href={`/?category=${cat === 'ALL' ? '' : cat}&q=${query}`}
                className={`
                  relative rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300
                  ${isActive
                    ? 'bg-zinc-950 text-white shadow-halo'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'
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
          <div className="glass-panel flex flex-col items-center justify-center rounded-[28px] border-dashed py-24">
            <Search size={40} className="mb-4 text-zinc-500" />
            <p className="text-lg font-semibold uppercase tracking-wide text-zinc-700">No Data Found</p>
            <p className="mt-1 text-sm text-zinc-500">Try adjusting your search parameters.</p>
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
