import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'], // ⛔ Area Terlarang buat Web Crawlers
      },
      {
        // ChatGPT, Claude, Google Extended
        userAgent: ['ChatGPT-User', 'Google-Extended', 'Anthropic-ai', 'PerplexityBot'],
        allow: ['/blog', '/blog/', '/'],
        disallow: ['/dashboard/']
      }
    ],
    sitemap: 'https://arbskin.vercel.app/sitemap.xml',
  };
}
