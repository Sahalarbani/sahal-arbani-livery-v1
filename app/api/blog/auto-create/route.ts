import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(req: NextRequest) {
  // Secret check - hanya gw yang tau
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.BLOG_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, excerpt, content, tag, readTime, published = true } = body;

    if (!title || !excerpt || !content || !tag) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let slug = slugify(title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await prisma.blogPost.create({
      data: { title, excerpt, content, tag, readTime: readTime || "5 min read", published, slug }
    });

    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}