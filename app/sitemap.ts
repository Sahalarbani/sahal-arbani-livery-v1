import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sahalarbani.my.id';

  const skins = await prisma.skin.findMany({
    select: { id: true, updatedAt: true },
  });

  const skinUrls = skins.map((skin) => ({
    url: `${baseUrl}/skin/${skin.id}`,
    lastModified: skin.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogBaseUrl = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  const hardcodedArticles = [
    "panduan-lengkap-memilih-livery-bus-simulator-terbaik-by-sahal-arbani",
    "mengapa-livery-kualitas-hd-penting-untuk-pengalaman-simulasi-balap",
    "cara-pasang-mod-livery-di-game-simulator-favoritmu"
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    blogBaseUrl,
    ...hardcodedArticles,
    ...skinUrls,
  ];
}
