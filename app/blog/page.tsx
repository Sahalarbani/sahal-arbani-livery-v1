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
  // Build tidak boleh gagal kalau tabel BlogPost belum ada saat prerender
  // (Prisma P2021 — migrasi baru jalan di postbuild, setelah build).
  // Kembalikan [] dan render daftar kosong; ISR revalidate 60 akan mencoba lagi nanti.
  // Catatan tipe: JANGAN anotasi dengan Awaited<ReturnType<typeof prisma.blogPost.findMany>>
  // — tanpa argumen select itu tipe BlogPost penuh, sedangkan findMany dengan select
  // hanya mengembalikan subset kolom, sehingga build gagal di pengecekan tipe.
  // Biarkan tipe terinferensi dari select lewat .catch(() => []).
  const articles = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, excerpt: true, tag: true, readTime: true, createdAt: true },
  }).catch((error) => {
    console.error('Failed to fetch blog posts (returning empty list so prerender does not fail):', error);
    return [];
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

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-brand-onyx rounded-2xl border border-white/5 border-dashed text-center px-6">
            <BookOpen size={40} className="text-gray-600 mb-4 opacity-50" />
            <h2 className="text-lg font-semibold text-gray-300 uppercase tracking-wide">Belum ada artikel</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-md">
              Artikel dan panduan seputar modding dan livery Truckers of Europe 3 akan tampil di sini setelah diterbitkan dari dashboard.
            </p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-accent text-brand-dark text-xs font-bold uppercase tracking-widest hover:bg-brand-accent/90 transition-colors">
              Lihat livery <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
        <div className="grid gap-6 mt-10">
          {articles.map((article) => (
            <article key={article.id} className="bg-brand-onyx border border-white/5 rounded-2xl p-6 md:p-8 hover:border-brand-accent/30 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark text-brand-sage text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20">
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
        )}

        <div className="mt-12">
          <AdSlot adSlotId="BOTTOM-ARTICLES" />
        </div>
      </div>
    </div>
  );
}
