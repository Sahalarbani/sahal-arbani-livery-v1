/**
 * CHANGELOG
 * Version: 2.2.0
 * Date: 2026-04-25
 * Description: Menambahkan isAdsActive dan slotDownload ke parameter upsert database.
 */

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdSettings() {
  try {
    let settings = await prisma.adSetting.findUnique({
      where: { id: "global-ads" }
    });

    if (!settings) {
      settings = await prisma.adSetting.create({
        data: { id: "global-ads" }
      });
    }

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
