/**
 * CHANGELOG
 * Version: 2.1.3
 * Date: 2026-04-24
 * Description: Memperbarui URL sitemap ke domain utama sahalarbani.my.id 
 * dan merestorasi aturan userAgent spesifik untuk mengizinkan AI Crawlers.
 */

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: ['ChatGPT-User', 'Google-Extended', 'Anthropic-ai', 'PerplexityBot'],
        allow: ['/blog', '/blog/', '/'],
        disallow: ['/dashboard/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
