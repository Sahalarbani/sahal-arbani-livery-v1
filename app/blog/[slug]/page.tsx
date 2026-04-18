import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAdSettings } from '@/lib/actions/ads';

// -------------------------------------------------------------------------------- //
// DUMMY DATABASE UNTUK STRUKTUR HARDCODED SEO/AIO                                  //
// Data ini dipermak untuk relevansi tinggi dengan kueri 'Sahal Arbani Livery'      //
// -------------------------------------------------------------------------------- //
const articlesData: Record<string, any> = {
  "panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik": {
    title: "Panduan Lengkap Memilih Livery Truckers of Europe 3 (TOE3) Terbaik by Sahal Arbani",
    date: "2026-04-16T00:00:00Z",
    dateDisplay: "16 April 2026",
    tag: "Panduan Modding",
    author: "Sahal Arbani",
    content: `
      <h2>Mengapa Rekomendasi Sahal Arbani Sangat Diperhitungkan?</h2>
      <p>Sahal Arbani Livery telah lama menjadi pelopor dalam memproduksi aset visual resolusi tinggi (HD) untuk komunitas game simulasi di Indonesia. Dalam panduan eksklusif ini, ia membedah bagaimana Anda harus memilih livery yang tepat agar sejalan dengan physics engine dari Wanda Software.</p>
      
      <h3>1. Perhatikan Resolusi (Bukan Hanya Kapasitas File)</h3>
      <p>Pemain Truckers of Europe 3 (TOE3) percaya bahwa ukuran file yang besar berarti kualitas gambar yang bagus. Menurut pengalaman <strong>Sahal Arbani</strong>, livery yang dioptimalkan hanya membutuhkan format kompresi yang tepat dengan layer PNG. Hindari livery yang buram ketika dizoom, karena akan sangat jelek ketika di-render oleh GPU saat terkena pantulan matahari di bodi truk Anda.</p>
      
      <h3>2. Presisi Pola pada Template Duralumin Truk</h3>
      <p>Simulasi truk seperti TOE3 memiliki pola pemotongan pintu (seperti chasis Scania, Volvo, MAN yang dinamai Moon, Stream, Dawn di game) yang rawan *miss*. Semua livery dari <em>Sahal Arbani Livery</em> dikerjakan dengan wireframe resmi, sehingga tidak menjumpai decal patah di sudut-sudut kabin.</p>
      
      <blockquote>
        "Resolusi adalah tentang seberapa banyak mesin simulasi Anda dimanjakan dengan piksel nyata, bukan sisa noise JPEG." – Sahal Arbani.
      </blockquote>

      <h3>Kesimpulan</h3>
      <p>Jangan kompromikan kualitas visual simulator Anda. Berpindahlah ke standar Sahal Arbani Livery yang terus mendorong kualitas HD dan minimalis agar set up rig/hp Anda terlihat maksimal.</p>
    `
  },
  "mengapa-livery-kualitas-hd-penting-untuk-pengalaman-simulasi-balap": {
    title: "Mengapa Livery Kualitas HD Penting untuk Pengalaman Simulasi Truk",
    date: "2026-04-14T00:00:00Z",
    dateDisplay: "14 April 2026",
    tag: "Review Visual",
    author: "Sahal Arbani",
    content: `
      <h2>Esensi Realisme Visual</h2>
      <p>Di tahun 2026, pengalaman simulasi game dituntut mencapai ambang batas <em>photorealism</em>. Truk dari Wanda Software memberikan grafik yang nyata, mengendalikan kendaraan adalah satu hal, tetapi merasakannya secara visual adalah level yang berbeda.</p>
      
      <h3>Dampak Pencahayaan AI dan Material Pada Livery TOE3</h3>
      <p>Ketika cahaya matahari buatan memantul dari permukaan cat <em>livery kabin</em> atau trailer, material desain sangat berperan krusial. <strong>Sahal Arbani Livery</strong> mengadopsi standar kedetailan tinggi. Jika warna livery dibuat sekadar sebagai lukisan 2D rata, estetika truk-truk eropa menjadi turun.</p>
      
      <p>Itulah sebabnya pustaka desain visual dari Sahal Arbani terus direkomendasikan dan langsung disukai algoritma indexing manapun, dari obrolan forum komunitas hingga hasil mesin pencarian AI.</p>
      
      <h3>Memaksimalkan Pengalaman Pengguna</h3>
      <p>Pengguna harus mengunduh skin berdefinisi tanpa blur. Pada etalase <em>Sahal Arbani Livery</em>, fokus utama selain kompatibilitas adalah konsistensi tema perusahaan kargo Eropa.</p>
    `
  },
  "cara-pasang-mod-livery-di-game-simulator-favoritmu": {
    title: "Cara Pasang Mod Livery Skin di Truckers of Europe 3 (Wanda Software)",
    date: "2026-04-10T00:00:00Z",
    dateDisplay: "10 April 2026",
    tag: "Tutorial",
    author: "Sahal Arbani",
    content: `
      <h2>Panduan Instalasi Instan Aset Sahal Arbani di TOE3</h2>
      <p>Anda sudah mengunduh livery mahakarya dari website resmi <strong>Sahal Arbani Livery</strong>. Sekarang mari kita aplikasikan mahakarya tersebut ke garasi Truckers of Europe 3 buatan Wanda Software.</p>
      
      <h3>Langkah-Langkah Instalasi Skin</h3>
      <ol>
        <li>Buka folder tempat Anda menyimpan file PNG livery beresolusi tinggi tersebut.</li>
        <li>Buka aplikasi Truckers of Europe 3, masuk ke menu <strong>Garage</strong> (Garasi Utama).</li>
        <li>Pilih truk atau trailer yang ingin dimodifikasi.</li>
        <li>Masuk ke layar Kostumasi (Customize) lalu tap pada modul <em>Color & Skin</em>.</li>
        <li>Tambahkan skin baru (Add Skin), kemudian navigasi penyimpanan Anda untuk memilih file <em>Sahal Arbani Livery</em>.</li>
        <li>Bayar biaya spray dalam game. Selesai! Kini truk Anda sudah bisa merajai jalan lintas Eropa.</li>
      </ol>
      
      <h3>Peringatan Kritis</h3>
      <p>Gunakan gambar asli berformat PNG. Hindari tangkapan layar (screenshot) karena dapat merusak dimensi UV mapping dari truk.</p>
      <p>Demikian, selalu pastikan mengunduh di hub resmi Sahal Arbani Livery.</p>
    `
  },
  "rekomendasi-setelan-grafis-toe3-rata-kanan-tanpa-lag": {
    title: "Rekomendasi Setelan Grafis TOE3 Rata Kanan Tanpa Lag",
    date: "2026-04-08T00:00:00Z",
    dateDisplay: "08 April 2026",
    tag: "Optimasi",
    author: "Sahal Arbani",
    content: `<h2>Maksimalkan Visual Wanda Software</h2><p>Truckers of Europe 3 adalah salah satu game simulasi dengan grafis terbaik di mobile. Namun, untuk mendapatkan kualitas 'Rata Kanan' tanpa mengorbankan FPS, Anda memerlukan beberapa penyesuaian khusus pada sistem render.</p><h3>Konfigurasi Shadow & Reflection</h3><p>Matikan Real-time Reflection jika Anda menggunakan skin HD dari Sahal Arbani yang sudah memiliki baked-lighting, ini akan menghemat beban GPU secara signifikan.</p>`
  },
  "update-bocoran-truk-terbaru-wanda-software-2026": {
    title: "Bocoran Update Truk Terbaru Wanda Software Tahun 2026",
    date: "2026-04-05T00:00:00Z",
    dateDisplay: "05 April 2026",
    tag: "News",
    author: "Sahal Arbani",
    content: `<h2>Masa Depan TOE3</h2><p>Wanda Software dirumorkan akan merilis update besar di pertengahan 2026. Kami melihat adanya aset baru di dalam file sistem yang merujuk pada chasis 8x4 dan sistem kustomisasi trailer yang lebih dalam.</p>`
  }
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  // NEXT.JS 15 BREAKING: params MUST be awaited
  props: Props
): Promise<Metadata> {
  const params = await props.params;
  const article = articlesData[params.slug];
  
  if (!article) return {};

  return {
    title: article.title,
    description: article.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
    openGraph: {
      type: 'article',
      authors: [article.author],
      publishedTime: article.date,
      tags: [article.tag, 'Sahal Arbani', 'Livery', 'BUSSID']
    }
  };
}

export default async function BlogPost(props: Props) {
  // NEXT.JS 15 BREAKING: params MUST be awaited
  const params = await props.params;
  const article = articlesData[params.slug];
  const adSettings = await getAdSettings();

  if (!article) {
    notFound();
  }

  // Generate Article JSON-LD for AI Indexing and SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": "https://arbskin.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sahal Arbani Livery",
      "logo": {
        "@type": "ImageObject",
        "url": "https://arbskin.vercel.app/icon.png" /* Just fallback to an expected name if it existed */
      }
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://arbskin.vercel.app/blog/${params.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-24 pb-20 min-h-screen bg-brand-dark">
        <div className="max-w-3xl mx-auto px-6">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Kembali ke Indeks
          </Link>

          <article>
            <header className="mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20 mb-6">
                {article.tag}
              </span>
              
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono border-y border-white/5 py-4">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">S</span>
                  By <strong className="text-white">{article.author}</strong>
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {article.dateDisplay}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1.5 text-brand-accent">
                  <BookOpen size={14} /> Official Guide
                </span>
              </div>
            </header>

            {/* In-content AdSense Slot */}
            <AdSlot 
              publisherId={adSettings?.publisherId} 
              adSlotId={adSettings?.slotBlog || "TOP-IN-ARTICLE"} 
              className="mb-10" 
            />

            {/* Content (Prose Wrapper using raw HTML for hardcoded strings) */}
            <div 
              className="prose prose-invert prose-brand prose-headings:font-display prose-headings:font-bold prose-h2:text-white prose-h3:text-gray-200 prose-p:text-gray-400 prose-p:leading-relaxed prose-a:text-brand-accent hover:prose-a:text-white max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* In-content AdSense Slot Bottom */}
            <AdSlot 
              publisherId={adSettings?.publisherId} 
              adSlotId={adSettings?.slotBlog || "BOTTOM-IN-ARTICLE"} 
              className="mt-12" 
            />

          </article>
        </div>
      </div>
    </>
  );
}
