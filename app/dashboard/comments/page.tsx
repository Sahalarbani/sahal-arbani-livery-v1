import { getCommentsAction } from "@/app/lib/admin-actions";
import CommentsClient from "@/components/CommentsClient";

// Opt-out of static rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CommentsPage() {
  const comments = await getCommentsAction();

  return (
    <CommentsClient initialComments={comments} />
  );
}
