"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addComment(formData: {
  skinId: string;
  userName: string;
  userImage?: string;
  content: string;
  token: string;
}) {
  const { skinId, userName, userImage, content, token } = formData;

  if (!content || content.trim().length === 0) {
    return { error: "Content is required" };
  }

  // Verify Turnstile Token (Cloudflare)
  const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const response = await fetch(verifyUrl, {
    method: 'POST',
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY, // Needs to be added to .env
      response: token,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const outcome = await response.json();
  if (!outcome.success && process.env.NODE_ENV === 'production') {
    return { error: "Security check failed. Please try again." };
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        skinId,
        userName,
        userImage,
        content,
      },
      include: {
        skin: { select: { title: true } }
      }
    });

    await prisma.activityLog.create({
      data: {
        action: "NEW_COMMENT",
        description: `New comment on ${newComment.skin.title}: "${content.substring(0, 30)}..."`,
        userName: userName
      }
    });

    revalidatePath(`/skin/${skinId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { error: "Failed to post comment" };
  }
}
