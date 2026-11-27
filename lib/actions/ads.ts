/**
 * CHANGELOG
 * Version: 2.2.0
 * Date: 2026-04-25
 * Description: Menambahkan isAdsActive dan slotDownload ke parameter upsert database.
 *
 * Optimasi cache (branch optimasi-cache):
 * - getAdSettings() tidak lagi melakukan create() di jalur baca.
 *   Membuat data di setiap kunjungan pertama memperlambat homepage
 *   dan memaksa akses tulis ke database saat baca. Buat data awal
 *   "global-ads" sekali lewat seed / dashboard (updateAdSettings),
 *   bukan saat ada pengunjung.
 * - Tambah getAdSettingsCached() dengan unstable_cache (revalidate 3600)
 *   agar homepage ISR tidak perlu query Prisma di setiap revalidasi.
 */

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";

export async function getAdSettings() {
  try {
    const settings = await prisma.adSetting.findUnique({
      where: { id: "global-ads" }
    });

    // Jangan create di sini. Kalau belum ada, kembalikan null dan
    // buat datanya lewat seed / dashboard.
    return settings;
  } catch (error) {
    console.error("Failed to fetch ad settings:", error);
    return null;
  }
}

export const getAdSettingsCached = unstable_cache(
  async () => getAdSettings(),
  ["ad-settings"],
  { revalidate: 3600 }
);

export async function updateAdSettings(data: {
  publisherId: string;
  isAdsActive: boolean;
  slotHome: string;
  slotDetail: string;
  slotBlog: string;
  slotDownload: string;
}) {
  try {
    await prisma.adSetting.upsert({
      where: { id: "global-ads" },
      update: data,
      create: { ...data, id: "global-ads" }
    });

    // Revalidasi semua cache agar kill-switch instan teraplikasi di seluruh halaman
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update ad settings:", error);
    return { error: "Failed to update settings" };
  }
}
