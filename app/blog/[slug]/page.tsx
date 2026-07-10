import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAdSettings } from '@/lib/actions/ads';
import { SITE_URL } from '@/lib/site';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const article = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt.substring(0, 160),
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      authors: ['Sahal Arbani'],
      publishedTime: article.createdAt.toISOString(),
      tags: [article.tag, 'Sahal Arbani', 'Livery', 'TOE3'],
    },
  };
}

export default async function BlogPost(props: Props) {
  const params = await props.params;
  const article = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  const adSettings = await getAdSettings();

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": { "@type": "Person", "name": "Sahal Arbani", "url": SITE_URL },
    "publisher": {
      "@type": "Organization",
      "name": "Sahal Arbani Livery",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.png` }
    },
    "datePublished": article.createdAt.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${article.slug}` }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono border-y border-white/5 py-4">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">S</span>
                  By <strong className="text-white">Sahal Arbani</strong>
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1.5 text-brand-accent">
                  <BookOpen size={14} /> {article.readTime}
                </span>
              </div>
            </header>

            <AdSlot publisherId={adSettings?.publisherId} adSlotId={adSettings?.slotBlog || "TOP-IN-ARTICLE"} className="mb-10" />

            <div
              className="prose prose-invert prose-brand prose-headings:font-display prose-headings:font-bold prose-h2:text-white prose-h3:text-gray-200 prose-p:text-gray-400 prose-p:leading-relaxed prose-a:text-brand-accent hover:prose-a:text-white max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <AdSlot publisherId={adSettings?.publisherId} adSlotId={adSettings?.slotBlog || "BOTTOM-IN-ARTICLE"} className="mt-12" />
          </article>
        </div>
      </div>
    </>
  );
}
