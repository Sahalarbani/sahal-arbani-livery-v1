import React from 'react';
import Link from 'next/link';
import { AdSlot } from '@/components/AdSlot';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Artikel & Panduan Simulasi',
  description: 'Kumpulan artikel Sahal Arbani seputar modding dan livery Truckers of Europe 3.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndex() {
  const articles = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, excerpt: true, tag: true, readTime: true, createdAt: true },
  });

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Kajian & <span className="text-brand-accent">Insight</span></h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Dokumentasi eksklusif mengenai ekosistem modding, rekomendasi livery, dan optimasi simulasi dari pangkalan data Sahal Arbani.
          </p>
        </header>

        <AdSlot adSlotId="TOP-HOME-ARTICLES" />

        <div className="grid gap-6 mt-10">
          {articles.map((article) => (
            <article key={article.id} className="bg-brand-onyx/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 hover:border-brand-accent/30 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20">
                  {article.tag}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                  <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {article.readTime}</span>
                </div>
              </div>

              <Link href={`/blog/${article.slug}`} className="block group-hover:text-brand-accent transition-colors">
                <h2 className="text-2xl font-bold text-gray-100 mb-3">{article.title}</h2>
              </Link>

              <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3">{article.excerpt}</p>

              <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white tracking-widest group-hover:text-brand-accent transition-all">
                Read Full Insight <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <AdSlot adSlotId="BOTTOM-ARTICLES" />
        </div>
      </div>
    </div>
  );
}
