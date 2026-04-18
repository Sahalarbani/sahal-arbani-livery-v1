import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditForm from "@/components/dashboard/EditForm"; 

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();

  // 1. Cek Admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  // 2. Ambil Data Lama
  const skin = await prisma.skin.findUnique({
    where: { id: resolvedParams.id },
  });

  // 3. Kalau gak ada, 404
  if (!skin) {
    notFound();
  }

  // 4. Render Form Client dengan Data Lama
  return (
    <div className="w-full">
      <EditForm skin={skin} />
    </div>
  );
}
