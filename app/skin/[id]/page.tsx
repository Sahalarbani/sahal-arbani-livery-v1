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
import { SITE_URL } from "@/lib/site";

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
    alternates: {
      canonical: `/skin/${skin.id}`,
    },
    robots: skin.published ? undefined : {
      index: false,
      follow: false,
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/skin/${skin.id}`,
      title: skin.title,
      description: skin.description,
      images: skin.image ? [skin.image] : undefined,
    },
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
    <div className="min-h-screen bg-transparent px-4 pb-12 pt-28 text-zinc-950 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Link Kembali ke Home */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 shadow-sm transition-colors hover:text-zinc-950"
        >
          <Home className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
          Return to Hub
        </Link>

        {/* Bento Grid layout for Detail Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Kolom Kiri: Gambar Skin */}
          <div className="space-y-6">
            <div className="glass-panel group relative aspect-video w-full overflow-hidden rounded-[28px] p-1">
              <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-zinc-100">
              {skin.image ? (
                <ClientImage
                  src={skin.image}
                  alt={skin.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-500">
                   <AlertTriangle size={36} className="opacity-50" />
                   <span className="ml-3 font-semibold uppercase tracking-widest text-xs">No Visual Source</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-60 pointer-events-none" />

              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-950 shadow-sm backdrop-blur-xl">
                  <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-brand-cyan" />
                  {skin.category}
                </span>
              </div>
              </div>
            </div>

            {/* Statistik / Metadata -> Simple Bento Mini Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="hairline-panel rounded-[20px] p-4 text-center transition-colors hover:bg-zinc-50">
                <div className="text-2xl font-black text-zinc-950">{skin.downloads}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">Downloads</div>
              </div>
              <div className="hairline-panel rounded-[20px] p-4 text-center transition-colors hover:bg-zinc-50">
                <Calendar className="mx-auto mb-2 text-brand-cyan" size={18} />
                <div className="mt-1 text-[11px] font-semibold text-zinc-600">{formattedDate}</div>
              </div>
              <div className="hairline-panel rounded-[20px] p-4 text-center transition-colors hover:bg-zinc-50">
                <User className="mx-auto mb-2 text-brand-accent" size={18} />
                <div className="mt-1 truncate px-1 text-[11px] font-semibold text-zinc-600">{skin.author}</div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail & Action */}
          <div className="glass-panel flex h-full flex-col rounded-[28px] p-7 lg:p-9">
            <div>
              <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-zinc-950 md:text-5xl">
                {skin.title}
              </h1>

              <div className="flex items-center gap-4 mb-10">
                {skin.published ? (
                  <div className="flex items-center rounded-full border border-brand-sage/20 bg-brand-sage/10 px-3 py-1.5 text-xs font-bold text-brand-sage">
                    <CheckCircle size={14} className="mr-1.5" />
                    Public Access
                  </div>
                ) : (
                  <div className="flex items-center rounded-full border border-brand-accent/20 bg-brand-accent/10 px-3 py-1.5 text-xs font-bold text-brand-accent">
                    <XCircle size={14} className="mr-1.5" />
                    Private
                  </div>
                )}
              </div>

              <div className="max-w-none mb-10">
                <h3 className="mb-4 border-b border-zinc-200 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cyan">
                  Technical Description
                </h3>
                <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-zinc-600">
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

            <div className="mt-auto border-t border-zinc-200 pt-8">
              <DownloadButton
                skinId={skin.id}
                downloadUrl={skin.downloadUrl}
                fileName={`${skin.title.replace(/\s+/g, '-')}.png`}
              />

              {/* Internal linking for visitor guidance. */}
              <div className="hairline-panel mt-8 rounded-[20px] p-4">
                <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Professional Insight & TOE3 Guides</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/blog/panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik" className="group flex items-center justify-between text-xs text-brand-cyan transition-colors hover:text-zinc-950">
                    <span>TOE3 Skin Selection Guide</span>
                    <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/blog/cara-pasang-mod-livery-di-game-simulator-favoritmu" className="group flex items-center justify-between text-xs text-brand-cyan transition-colors hover:text-zinc-950">
                    <span>How to install TOE3 Skins (Wanda)</span>
                    <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context section for visitors arriving from search engines. */}
        <div className="mt-20 border-t border-zinc-200 pt-10 text-center">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-[0.3em] text-zinc-500">SKINS TRUCKERS OF EUROPE 3</h2>
            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-zinc-500">
                Sahal Arbani Livery menyediakan skin Truckers of Europe 3 (TOE3) karya Sahal Arbani.
                Gunakan preview dan deskripsi teknis pada setiap halaman untuk memilih livery yang sesuai dengan truk Anda.
            </p>
        </div>

        {/* Dynamic Recommendations - 5 Posts for SEO stickiness */}
        <div className="mt-20">
          <h3 className="mb-8 border-l-4 border-brand-cyan pl-4 text-xl font-bold text-zinc-950">Exclusive Insights for Truckers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recommendedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="hairline-panel group flex flex-col justify-between rounded-[20px] p-5 transition-all hover:border-brand-cyan/30"
              >
                <div>
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brand-sage">{article.category}</span>
                  <h4 className="line-clamp-2 text-sm font-bold leading-snug text-zinc-800 transition-colors group-hover:text-brand-cyan">
                    {article.title}
                  </h4>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 font-mono text-[10px] uppercase text-zinc-500">
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
