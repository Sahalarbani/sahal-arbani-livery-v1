import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditBlogForm from "./EditBlogForm";

export default async function EditBlogWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/");

  const post = await prisma.blogPost.findUnique({ where: { id: resolvedParams.id } });
  if (!post) notFound();

  return <EditBlogForm post={post} />;
}
