import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAdSettings } from '@/lib/actions/ads';
import { SITE_URL } from '@/lib/site';
import { articlesData } from '@/lib/blog-data';

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
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
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
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sahal Arbani Livery",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/icon.png`
      }
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${params.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen pb-20 pt-28">
        <div className="max-w-3xl mx-auto px-6">
          
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-50">
            <ArrowLeft size={16} /> Kembali ke Indeks
          </Link>

          <article>
            <header className="mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20 mb-6">
                {article.tag}
              </span>
              
              <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-zinc-50 md:text-5xl">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 border-y border-white/10 py-4 font-mono text-xs text-zinc-500">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">S</span>
                  By <strong className="text-zinc-50">{article.author}</strong>
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
              className="prose prose-invert prose-brand prose-headings:font-display prose-headings:font-bold prose-a:text-brand-cyan hover:prose-a:text-zinc-50 max-w-none"
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
