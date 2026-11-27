import { prisma } from '@/lib/prisma';

export async function getCategories() {
  const dbCategories = await prisma.skin.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });

  return [
    "ALL",
    ...dbCategories
      .map((c) => c.category)
      .filter(Boolean)
      .sort()
  ];
}

export async function getSkins(query: string = '', categoryFilter: string = 'ALL') {
  const whereCondition: any = {
    published: true,
    AND: [
      {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    ],
  };

  if (categoryFilter !== 'ALL') {
    whereCondition.AND.push({
      category: { equals: categoryFilter, mode: "insensitive" },
    });
  }

  // Optimasi cache (branch optimasi-cache):
  // Ambil hanya kolom yang dipakai SkinCard / homepage, dan batasi
  // ke 24 skin terbaru. Sebelumnya semua kolom diambil tanpa batas.
  return await prisma.skin.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
    take: 24,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      image: true,
      downloads: true,
      createdAt: true,
    },
  });
}
