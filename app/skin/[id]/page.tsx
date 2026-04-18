import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Calendar, User, CheckCircle, XCircle, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DownloadButton } from "@/components/DownloadButton"; 
import ClientImage from "@/components/ClientImage";
import { CommentSection } from "@/components/CommentSection";
import { AdSlot } from "@/components/AdSlot";
import { getAdSettings } from "@/lib/actions/ads";

// ✅ Caching Strategy: Incremental Static Regeneration (ISR)
export const revalidate = 60; 

// Data Hardcoded Articles for Recommendation (Sync with blog page)
const recommendedArticles = [
  {
    id: "panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik",
    title: "Panduan Lengkap Memilih Livery Truckers of Europe 3 (TOE3) Terbaik",
    category: "Panduan"
  },
  {
    id: "mengapa-livery-kualitas-hd-penting-untuk-pengalaman-simulasi-balap",
    title: "Mengapa Livery Kualitas HD Penting untuk Pengalaman Truk",
    category: "Visual"
  },
  {
    id: "cara-pasang-mod-livery-di-game-simulator-favoritmu",
    title: "Cara Pasang Mod Livery Skin di Truckers of Europe 3",
    category: "Tutorial"
  },
  {
    id: "rekomendasi-setelan-grafis-toe3-rata-kanan-tanpa-lag",
    title: "Rekomendasi Setelan Grafis TOE3 Rata Kanan Tanpa Lag",
    category: "Optimasi"
  },
  {
    id: "update-bocoran-truk-terbaru-wanda-software-2026",
    title: "Bocoran Update Truk Terbaru Wanda Software Tahun 2026",
    category: "Berita"
  }
];

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const skin = await prisma.skin.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!skin) return { title: "Skin Not Found" };

  return {
    title: `${skin.title} - ArbSkinz`,
    description: skin.description,
  };
}

export default async function SkinPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await auth();
  const adSettings = await getAdSettings();

  const skin = await prisma.skin.findUnique({
    where: { id: resolvedParams.id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!skin) return notFound();

  const formattedDate = new Date(skin.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-brand-dark text-gray-200 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Link Kembali ke Home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 hover:text-brand-accent transition-colors mb-10 group font-semibold uppercase tracking-widest text-xs"
        >
          <Home className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
          Return to Hub
        </Link>

        {/* Bento Grid layout for Detail Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Gambar Skin */}
          <div className="space-y-6">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/5 bg-brand-onyx group">
              {skin.image ? (
                <ClientImage 
                  src={skin.image} 
                  alt={skin.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-onyx text-gray-600">
                   <AlertTriangle size={36} className="opacity-50" />
                   <span className="ml-3 font-semibold uppercase tracking-widest text-xs">No Visual Source</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-dark/80 backdrop-blur-md border border-white/5 text-brand-sage shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse mr-2" />
                  {skin.category}
                </span>
              </div>
            </div>

            {/* Statistik / Metadata -> Simple Bento Mini Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-brand-onyx border border-white/5 p-4 rounded-2xl text-center hover:bg-brand-onyx/80 transition-colors">
                <div className="text-2xl font-bold text-gray-100">{skin.downloads}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Downloads</div>
              </div>
              <div className="bg-brand-onyx border border-white/5 p-4 rounded-2xl text-center hover:bg-brand-onyx/80 transition-colors">
                <Calendar className="mx-auto mb-2 text-gray-400" size={18} />
                <div className="text-[11px] font-medium text-gray-300 mt-1">{formattedDate}</div>
              </div>
              <div className="bg-brand-onyx border border-white/5 p-4 rounded-2xl text-center hover:bg-brand-onyx/80 transition-colors">
                <User className="mx-auto mb-2 text-gray-400" size={18} />
                <div className="text-[11px] font-medium text-gray-300 mt-1 truncate px-1">{skin.author}</div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail & Action */}
          <div className="flex flex-col h-full bg-brand-onyx rounded-3xl border border-white/5 p-8 lg:p-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-100 tracking-tight leading-tight">
                {skin.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-10">
                {skin.published ? (
                  <div className="flex items-center text-brand-sage text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-sage/10 border border-brand-sage/20">
                    <CheckCircle size={14} className="mr-1.5" />
                    Public Access
                  </div>
                ) : (
                  <div className="flex items-center text-brand-accent text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                    <XCircle size={14} className="mr-1.5" />
                    Private
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none mb-10">
                <h3 className="text-[11px] font-bold text-brand-sage mb-4 tracking-[0.2em] border-b border-white/10 pb-3 uppercase">
                  Technical Description
                </h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                  {skin.description}
                </p>
              </div>

              {/* Dynamic Ad Slot in Detail Page */}
              <AdSlot 
                publisherId={adSettings?.publisherId} 
                adSlotId={adSettings?.slotDetail || "SKIN-DETAIL-AD"} 
                className="mb-8"
              />
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <DownloadButton 
                skinId={skin.id}
                downloadUrl={skin.downloadUrl}
                fileName={`${skin.title.replace(/\s+/g, '-')}.png`}
              />
              
              {/* Internal Linking for SEO/AdSense - Target: Kivel Skinz traffic */}
              <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Professional Insight & TOE3 Guides</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/blog/panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik" className="text-xs text-brand-accent hover:text-white transition-colors flex items-center justify-between group">
                    <span>TOE3 Skin Selection Guide</span>
                    <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/blog/cara-pasang-mod-livery-di-game-simulator-favoritmu" className="text-xs text-brand-accent hover:text-white transition-colors flex items-center justify-between group">
                    <span>How to install TOE3 Skins (Wanda)</span>
                    <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global SEO Traffic Hack Section */}
        <div className="mt-20 border-t border-white/5 pt-10 text-center">
            <h2 className="text-xl font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">SKINS TRUCKERS OF EUROPE 3</h2>
            <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Looking for <span className="text-gray-400">Kivel Skinz</span> or <span className="text-gray-400">Garageskins.com.br</span>? 
                Sahal Arbani Livery provides the highest resolution skins for Truckers of Europe 3 (TOE3) by Wanda Software. 
                Experience a new level of realism beyond standard repositories.
            </p>
        </div>

        {/* Dynamic Recommendations - 5 Posts for SEO stickiness */}
        <div className="mt-20">
          <h3 className="text-xl font-bold text-white mb-8 border-l-4 border-brand-accent pl-4">Exclusive Insights for Truckers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recommendedArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/blog/${article.id}`}
                className="group p-5 rounded-2xl bg-brand-onyx border border-white/5 hover:border-brand-accent/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-brand-sage uppercase tracking-widest mb-2 block">{article.category}</span>
                  <h4 className="text-sm font-bold text-gray-200 group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase">
                  <span>Read Article</span>
                  <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Comment Section with Cloudflare Turnstile */}
        <CommentSection 
          skinId={skin.id} 
          comments={skin.comments} 
          initialUserName={session?.user?.name || ""}
        />
      </div>
    </div>
  );
}
