import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText, Clock, Edit3, Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/app/lib/actions";

export const dynamic = 'force-dynamic';

export default async function BlogDashboard() {
  const session = await auth();
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 uppercase tracking-tight">
            Blog <span className="text-brand-accent">Manager</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            {posts.length} Articles Published
          </p>
        </div>
        <Link
          href="/dashboard/blog/create"
          className="group relative px-6 py-3 bg-brand-accent text-brand-dark font-black uppercase text-sm rounded-full transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex items-center gap-2 relative z-10">
            <Plus size={18} strokeWidth={2.5} /> New Article
          </div>
        </Link>
      </div>

      <div className="bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-dark/50 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Title</th>
                <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Tag</th>
                <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Created</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="group hover:bg-brand-dark/30 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-brand-accent flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-100 truncate max-w-[300px]">{post.title}</p>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold uppercase text-brand-sage bg-brand-sage/10 px-3 py-1 rounded-full border border-brand-sage/20">{post.tag}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${post.published ? 'bg-brand-sage/10 border-brand-sage/20 text-brand-sage' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-[10px] text-gray-500 font-medium">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/blog/edit/${post.id}`} className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-dark border border-white/5 text-gray-400 hover:text-brand-accent hover:border-brand-accent/30 transition-all">
                        <Edit3 size={14} />
                      </Link>
                      <form action={async () => { "use server"; await deleteBlogPost(post.id); }}>
                        <button type="submit" className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-dark border border-white/5 text-gray-400 hover:text-red-500 hover:border-red-500/30 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <Clock size={24} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No articles yet</p>
                    <Link href="/dashboard/blog/create" className="text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline mt-2 inline-block">Create First Article</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
