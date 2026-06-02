import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const skins = await prisma.skin.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

  const skinUrls = skins.map((skin) => ({
    url: `${SITE_URL}/skin/${skin.id}`,
    lastModified: skin.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogBaseUrl = {
    url: `${SITE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  const hardcodedArticles = [
    "panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik",
    "mengapa-livery-kualitas-hd-penting-untuk-pengalaman-simulasi-balap",
    "cara-pasang-mod-livery-di-game-simulator-favoritmu",
    "rekomendasi-setelan-grafis-toe3-rata-kanan-tanpa-lag",
    "update-bocoran-truk-terbaru-wanda-software-2026"
  ].map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    blogBaseUrl,
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...hardcodedArticles,
    ...skinUrls,
  ];
}
