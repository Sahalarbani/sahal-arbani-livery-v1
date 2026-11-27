"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCommentsAction() {
    // SEC4: hanya admin boleh membaca semua komentar (pola yang sama seperti
    // deleteCommentAction di bawah).
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return [];
    }

    try {
      const comments = await prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          skin: { select: { title: true } }
        }
      });
      return comments;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  
  export async function deleteCommentAction(id: string): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  
    try {
      await prisma.comment.delete({
        where: { id }
      });
      
      // LOG IT
      await prisma.activityLog.create({
        data: {
          action: "DELETE_COMMENT",
          description: `Deleted comment ID: ${id}`,
          userName: session.user.name || "Admin"
        }
      });
  
      revalidatePath('/dashboard/comments');
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: "Failed to delete comment" };
    }
  }
  
  export async function getLogsAction() {
    // SEC4: hanya admin boleh membaca activity log.
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return [];
    }

    try {
      const logs = await prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100 // limit to last 100
      });
      return logs;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

