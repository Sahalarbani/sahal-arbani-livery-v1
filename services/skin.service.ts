import { prisma } from '@/lib/prisma';

// Minor #1 (QC retest 27 Nov 2026): kategori "street" dan "Stream st" di
// database adalah trailer yang sama. Bukti dari data produksi: ketiga skin
// trailer Stream St terbagi ke dua penulisan kategori — "LIVERY STREAM ST"
// berkategori "Stream st", sedangkan "LIVERY TRUCK STREAM ST" dan
// "Livery stream st" berkategori "street". Tidak ada skin lain yang memakai
// "street" untuk arti berbeda, jadi keduanya dikanonikalisasi ke satu
// filter "Stream St". Data di DB tidak diubah; penggabungan hanya di
// lapisan tampilan/pencarian supaya tidak ada skin yang hilang.
export function canonicalCategory(raw: string): string {
  const key = raw.trim().toLowerCase();
  if (key === "street" || key === "stream st") return "Stream St";
  return raw.trim();
}

export async function getCategories() {
  const dbCategories = await prisma.skin.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });

  // B6: dedupe kategori yang hanya berbeda huruf besar/kecil atau spasi
  // (mis. "Truck" vs "TRUCK" di database) supaya tombol filter tidak ganda,
  // plus kanonikalisasi "street" -> "Stream St" (lihat canonicalCategory).
  const seen = new Map<string, string>();
  for (const raw of dbCategories.map((c) => c.category).filter(Boolean)) {
    const canonical = canonicalCategory(raw);
    const key = canonical.toLowerCase();
    if (!seen.has(key)) seen.set(key, canonical);
  }
  return ["ALL", ...[...seen.values()].sort((a, b) => a.localeCompare(b))];
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
    const canonical = canonicalCategory(categoryFilter);
    if (canonical === "Stream St") {
      // "Stream St" di DB tertulis dua cara; cocokkan keduanya supaya
      // tidak ada skin Stream St yang hilang dari hasil filter.
      whereCondition.AND.push({
        OR: [
          { category: { equals: "Stream st", mode: "insensitive" } },
          { category: { equals: "street", mode: "insensitive" } },
        ],
      });
    } else {
      whereCondition.AND.push({
        category: { equals: categoryFilter, mode: "insensitive" },
      });
    }
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
