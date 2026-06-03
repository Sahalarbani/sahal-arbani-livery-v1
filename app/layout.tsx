/**
 * CHANGELOG
 * Version: 2.1.2
 * Date: 2026-04-24
 * Description: Pembaruan arsitektur metadata untuk SEO. Mengganti seluruh referensi arbskin.vercel.app menjadi sahalarbani.my.id. Menambahkan konfigurasi alternates canonical untuk memperbaiki isu duplikasi di Google Search Console.
 */

import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { auth } from '@/auth';
import CookieConsent from '@/components/CookieConsent';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';
import { getAdSettings } from '@/lib/actions/ads';
import { SITE_URL } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: '/',
  },

  title: {
    default: 'SKINS TRUCKERS OF EUROPE 3 - Sahal Arbani Livery',
    template: '%s | SKINS TRUCKERS OF EUROPE 3'
  },
  description: 'Download skin dan livery Truckers of Europe 3 (TOE3) karya Sahal Arbani, lengkap dengan preview, deskripsi, dan panduan pemasangan.',

  verification: {
    google: "MfVKdARbKQI9xXb3uU9WwT1oOMq8xe8NjbzdY5VZgn4",
  },

  openGraph: {
    title: 'SKINS TRUCKERS OF EUROPE 3 - HD Assets',
    description: 'Download skin dan livery Truckers of Europe 3 karya Sahal Arbani, lengkap dengan preview dan panduan pemasangan.',
    url: SITE_URL,
    siteName: 'Sahal Arbani Livery',
    locale: 'id_ID',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'SKINS TRUCKERS OF EUROPE 3',
    description: 'Skin dan livery TOE3 karya Sahal Arbani.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const adSettings = await getAdSettings();

  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
                {adSettings?.isAdsActive && adSettings?.publisherId && (
                  <Script
                    id="adsense"
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSettings.publisherId}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                  />
                )}

        <Script
          id="json-ld-person"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sahal Arbani",
              "url": SITE_URL,
              "sameAs": [
                "https://www.tiktok.com/@sahal.arbani",
                "https://www.instagram.com/sahalarbani413"
              ],
              "jobTitle": "Digital Designer & Asset Creator",
              "description": "Sahal Arbani membuat skin dan livery untuk Truckers of Europe 3 (TOE3)."
            })
          }}
        />
      </head>
      <body className="font-sans font-medium antialiased bg-black text-zinc-50 min-h-screen flex flex-col">
        <Navbar user={session?.user as any} />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />

        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
