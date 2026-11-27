successfully downloaded text file (SHA: 29fb8046c48a80efd326c65e40255045defd6027)
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
 *
 * Perbaikan build (branch optimasi-cache, setelah Vercel gagal):
 * - Hapus getAdSettingsCached() dengan unstable_cache dari file ini.
 *   File "use server" hanya boleh mengekspor async function, dan
 *   mengekspor const dari unstable_cache membuat build Next.js gagal.
 *   ISR dengan revalidate 3600 di app/page.tsx sudah cukup untuk caching.
 */

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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

export async function updateAdSettings(data: {
  publisherId: string;
  isAdsActive: boolean;
  slotHome: string;
  slotDetail: string;
  slotBlog: string;
  slotDownload: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // SEC2: hanya admin boleh mengubah pengaturan iklan. Sebelumnya fungsi
    // ini tanpa cek auth sehingga siapa pun bisa memanggil server action ini
    // dan mengganti publisherId AdSense.
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

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
    return { success: false, error: "Failed to update settings" };
  }
}

