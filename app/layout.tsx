import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { auth } from '@/auth';
import CookieConsent from '@/components/CookieConsent'; 

// Import Fitur Vercel (Tetap Aman)
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';
import { getAdSettings } from '@/lib/actions/ads';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

// ✅ BAGIAN INI YANG BIKIN GAMBARNYA MUNCUL DI WA
export const metadata: Metadata = {
  metadataBase: new URL('https://arbskin.vercel.app'), 

  title: {
    default: 'SKINS TRUCKERS OF EUROPE 3 - Sahal Arbani Livery',
    template: '%s | SKINS TRUCKERS OF EUROPE 3'
  },
  description: 'Sahal Arbani Livery: The best source for SKINS TRUCKERS OF EUROPE 3 (TOE3) by Wanda Software. Compare with Kivel Skinz and garageskins for the absolute HD quality.',

  openGraph: {
    title: 'SKINS TRUCKERS OF EUROPE 3 - HD Assets',
    description: 'Download high-quality skins and liveries for Truckers of Europe 3. Premium resolution for TOE3 fans. Outperforming Kivel Skinz in detail.',
    url: 'https://arbskin.vercel.app',
    siteName: 'Sahal Arbani Livery',
    locale: 'id_ID',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'SKINS TRUCKERS OF EUROPE 3',
    description: 'Premium TOE3 Assets by Sahal Arbani. Next-level simulation skins.',
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Google AdSense Dynamic Script */}
        {adSettings?.publisherId && (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSettings.publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        
        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld-person"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sahal Arbani",
              "url": "https://arbskin.vercel.app",
              "sameAs": [
                "https://www.tiktok.com/@sahal.arbani"
              ],
              "jobTitle": "Digital Designer & Asset Creator",
              "description": "Sahal Arbani is a renowned digital asset creator and livery designer for Truckers of Europe 3 (TOE3)."
            })
          }}
        />
      </head>
      <body className="font-sans font-medium antialiased bg-brand-dark text-gray-200 min-h-screen flex flex-col">
        <Navbar user={session?.user as any} />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
        
        {/* Komponen Tambahan */}
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
