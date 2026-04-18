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
  slotHome: string;
  slotDetail: string;
  slotBlog: string;
}) {
  try {
    await prisma.adSetting.upsert({
      where: { id: "global-ads" },
      update: data,
      create: { ...data, id: "global-ads" }
    });

    revalidatePath("/dashboard/ads");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/skin", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update ad settings:", error);
    return { error: "Failed to update settings" };
  }
}
