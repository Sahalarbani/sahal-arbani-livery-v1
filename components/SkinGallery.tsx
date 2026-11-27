"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid } from "lucide-react";
import { SkinCard } from "@/components/SkinCard";
import type { Skin } from "../types";

// B1: pencarian & filter homepage dipindah ke client.
// Homepage server tetap force-static / ISR (revalidate 3600) supaya
// TTFB dan X-Vercel-Cache: PRERENDER tidak rusak; data yang sudah
// di-fetch server (maks. 24 skin) disaring di memori, tanpa request
// server tambahan dan tanpa memaksa halaman menjadi dinamis.
export function SkinGallery({ skins, categories }: { skins: Skin[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skins.filter((skin) => {
      const matchesQuery =
        !q ||
        skin.title.toLowerCase().includes(q) ||
        skin.description.toLowerCase().includes(q);
      const matchesCategory =
        category === "ALL" || skin.category.toLowerCase() === category.toLowerCase();
      return matchesQuery && matchesCategory;
    });
  }, [skins, query, category]);

  const clearFilters = () => {
    setQuery("");
    setCategory("ALL");
  };

  return (
    <div id="gallery" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
      {/* Search */}
      <div className="max-w-xl mx-auto relative group mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-accent transition-colors">
          <Search size={22} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search TOE3 skins / liveries..."
          aria-label="Search skins"
          className="w-full bg-brand-onyx border border-white/5 focus:border-brand-accent/50 rounded-full py-4 pl-14 pr-6 text-gray-200 placeholder-gray-500 tracking-wide outline-none transition-all duration-300 shadow-sm"
        />
      </div>

      {/* Separator */}
      <div className="flex items-center justify-center gap-4 mb-10 opacity-40">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-500" />
        <LayoutGrid size={14} className="text-gray-400" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-500" />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6" role="group" aria-label="Filter by category">
        {categories.map((cat) => {
          const isActive = category.toUpperCase() === cat.toUpperCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={isActive}
              className={`px-5 py-2 rounded-full font-semibold text-[11px] uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-brand-accent text-brand-dark shadow-sm scale-[1.02]"
                  : "bg-brand-onyx text-gray-400 border border-transparent hover:bg-brand-onyx/80 hover:text-gray-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-500 font-medium mb-12" aria-live="polite">
        {filtered.length === 0
          ? "No skins match your search."
          : `${filtered.length} ${filtered.length === 1 ? "livery" : "liveries"} shown`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-brand-onyx rounded-[24px] border border-white/5 border-dashed">
          <Search size={40} className="text-gray-600 mb-4 opacity-50" />
          <p className="text-lg font-semibold text-gray-400 uppercase tracking-wide">No skins found</p>
          <p className="text-gray-500 mt-1 text-sm">Try a different search or category.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 px-6 py-2.5 rounded-full bg-brand-accent text-brand-dark text-xs font-bold uppercase tracking-widest hover:bg-brand-accent/90 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((skin) => (
            <SkinCard key={skin.id} skin={skin as any} href={`/skin/${skin.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
