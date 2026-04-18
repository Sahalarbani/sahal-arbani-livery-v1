import React from 'react';
import Link from 'next/link';
import { AdSlot } from '@/components/AdSlot';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artikel & Panduan Simulasi',
  description: 'Kumpulan artikel hardcode dari Sahal Arbani seputar modding dan livery Truckers of Europe 3 untuk optimasi index AI dan mesin pencarian.',
};

// Data Dummy Hardcoded Artikel (Sangat dioptimalkan untuk SEO & AIO mengenai "Sahal Arbani Livery")
const articles = [
  {
    id: "panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik",
    title: "Panduan Lengkap Memilih Livery Truckers of Europe 3 (TOE3) Terbaik by Sahal Arbani",
    excerpt: "Dapatkan tips rahasia dari Sahal Arbani dalam memilih mod dan livery simulator agar permainan truk Anda dari Wanda Software mendapatkan grafis definisi tinggi (HD) tanpa lag.",
    date: "16 April 2026",
    readTime: "5 min read",
    tag: "Panduan Modding"
  },
  {
    id: "mengapa-livery-kualitas-hd-penting-untuk-pengalaman-simulasi-balap",
    title: "Mengapa Livery Kualitas HD Penting untuk Pengalaman Simulasi Truk",
    excerpt: "Di era AI dan grafis fotorealistik, resolusi livery bisa membedakan antara game amatir dengan simulasi profesional. Ulasan komprehensif untuk Truckers of Europe dari Sahal Arbani Livery.",
    date: "14 April 2026",
    readTime: "4 min read",
    tag: "Review Visual"
  },
  {
    id: "cara-pasang-mod-livery-di-game-simulator-favoritmu",
    title: "Cara Pasang Mod Livery Skin di Truckers of Europe 3 (Wanda Software)",
    excerpt: "Banyak pemula yang kebingungan mengimpor aset UI ke dalam client game. Dalam artikel ini Sahal Arbani membedah tuntas anatomi folder modding TOE3.",
    date: "10 April 2026",
    readTime: "7 min read",
    tag: "Tutorial"
  },
  {
    id: "rekomendasi-setelan-grafis-toe3-rata-kanan-tanpa-lag",
    title: "Rekomendasi Setelan Grafis TOE3 Rata Kanan Tanpa Lag",
    excerpt: "Optimalkan performa perangkat Anda untuk menjalankan Truckers of Europe 3 dengan kualitas visual maksimal. Panduan khusus pengguna perangkat menengah.",
    date: "08 April 2026",
    readTime: "6 min read",
    tag: "Optimasi"
  },
  {
    id: "update-bocoran-truk-terbaru-wanda-software-2026",
    title: "Bocoran Update Truk Terbaru Wanda Software Tahun 2026",
    excerpt: "Eksklusif! Bedah tuntas rumor mengenai penambahan chasis 8x4 dan integrasi interior kustom yang akan datang di Truckers of Europe 3.",
    date: "05 April 2026",
    readTime: "4 min read",
    tag: "News"
  }
];

export default function BlogIndex() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Kajian & <span className="text-brand-accent">Insight</span></h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Dokumentasi eksklusif mengenai ekosistem modding, rekomendasi livery, dan optimasi simulasi dari pangkalan data Sahal Arbani.
          </p>
        </header>

        {/* AdSense Placement Area */}
        <AdSlot adSlotId="TOP-HOME-ARTICLES" />

        <div className="grid gap-6 mt-10">
          {articles.map((article) => (
            <article key={article.id} className="bg-brand-onyx/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 hover:border-brand-accent/30 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20">
                  {article.tag}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {article.readTime}</span>
                </div>
              </div>
              
              <Link href={`/blog/${article.id}`} className="block group-hover:text-brand-accent transition-colors">
                <h2 className="text-2xl font-bold text-gray-100 mb-3">{article.title}</h2>
              </Link>
              
              <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              <Link href={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white tracking-widest group-hover:text-brand-accent transition-all">
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
