import React from 'react';
import Link from 'next/link';
import { AdSlot } from '@/components/AdSlot';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Metadata } from 'next';
import { articles } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'Artikel & Panduan Simulasi',
  description: 'Kumpulan artikel Sahal Arbani seputar modding dan livery Truckers of Europe 3.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen pb-20 pt-28">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-zinc-50 md:text-5xl">Kajian & <span className="text-brand-accent">Insight</span></h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Dokumentasi eksklusif mengenai ekosistem modding, rekomendasi livery, dan optimasi simulasi dari pangkalan data Sahal Arbani.
          </p>
        </header>

        {/* AdSense Placement Area */}
        <AdSlot adSlotId="TOP-HOME-ARTICLES" />

        <div className="grid gap-6 mt-10">
          {articles.map((article) => (
            <article key={article.id} className="surface-card group p-6 transition-all duration-300 hover:border-zinc-950 md:p-8">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20">
                  {article.tag}
                </span>
                <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {article.readTime}</span>
                </div>
              </div>
              
              <Link href={`/blog/${article.id}`} className="block transition-colors group-hover:text-brand-cyan">
                <h2 className="mb-3 text-2xl font-bold text-zinc-50">{article.title}</h2>
              </Link>
              
              <p className="mb-6 line-clamp-3 leading-relaxed text-zinc-400">
                {article.excerpt}
              </p>

              <Link href={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-zinc-50 transition-all group-hover:text-brand-cyan">
                Read Full Insight <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>

        {/* AdSense Placement Area Bawah */}
        <div className="mt-12">
            <AdSlot adSlotId="BOTTOM-ARTICLES" />
        </div>
      </div>
    </div>
  );
}
