import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Plus, CheckCircle2, Clock, Box, ChevronLeft, ChevronRight, AlertTriangle, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import { PostActions } from '@/components/dashboard/PostActions';

const getThumbUrl = (url: string) => {
  if (!url) return null;
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_200,q_auto,f_auto/");
  }
  return url;
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  const query = resolvedSearchParams?.q || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 10;

  const where = {
    title: { contains: query, mode: 'insensitive' as const },
  };

  const [totalSkins, publishedSkins, lastSkin, allSkins, totalFiltered] = await Promise.all([
    prisma.skin.count(),
    prisma.skin.count({ where: { published: true } }),
    prisma.skin.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.skin.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.skin.count({ where }),
  ]);

  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const timeSinceLastUpdate = lastSkin ? new Date(lastSkin.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
                    Dashboard
                </h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                    Masuk sebagai: {session?.user?.name || 'Admin'}
                </p>
            </div>
            <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-brand-accent text-brand-dark font-black uppercase text-sm rounded-full transition-all hover:shadow-md"
            >
                <Plus size={18} strokeWidth={2.5} /> Tambah Skin
            </Link>
        </div>

        {/* STATS CARDS - angka nyata dari database, bukan status palsu */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 mb-8 sm:mb-12">
           <div className="relative p-5 sm:p-6 bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden group">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-brand-dark rounded-2xl text-brand-accent border border-white/5"><Box size={24} /></div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Skin</p>
                     <p className="text-3xl font-black text-gray-100">{totalSkins}</p>
                 </div>
             </div>
           </div>

           <div className="relative p-5 sm:p-6 bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden group">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-brand-dark rounded-2xl text-brand-sage border border-white/5"><CheckCircle2 size={24} /></div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dipublikasikan</p>
                     <p className="text-3xl font-black text-gray-100">{publishedSkins}</p>
                 </div>
             </div>
           </div>

           <div className="relative p-5 sm:p-6 bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden group">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-brand-dark rounded-2xl text-brand-sage border border-white/5"><Clock size={24} /></div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Terakhir Ditambah</p>
                     <p className="text-3xl font-black text-gray-100">{timeSinceLastUpdate}</p>
                 </div>
             </div>
           </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden">
           {/* Petunjuk scroll horizontal di mobile: tanpa ini pengguna tidak
               tahu ada kolom di kanan (Minor #2 QC retest). */}
           <p className="md:hidden flex items-center justify-end gap-1 px-4 pt-4 text-[11px] font-medium text-gray-500">
             Geser untuk melihat kolom lain <ChevronRight size={14} />
           </p>
           <div className="relative overflow-x-auto">
             {/* Fade di tepi kanan sebagai petunjuk visual ada konten di kanan */}
             <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-brand-onyx to-transparent z-10" aria-hidden="true" />
             <table className="w-full min-w-[760px] text-left border-collapse">
               <thead>
                 <tr className="bg-brand-dark/50 border-b border-white/5">
                   <th className="px-4 md:px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Skin</th>
                   <th className="px-4 md:px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Status</th>
                   <th className="px-4 md:px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Kategori</th>
                   <th className="px-4 md:px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Dibuat</th>
                   <th className="px-4 md:px-8 py-5 text-right text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {allSkins.map((skin) => (
                   <tr key={skin.id} className="group hover:bg-brand-dark/30 transition-colors duration-200">
                     <td className="px-4 md:px-8 py-4">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/5 relative bg-brand-dark">
                           {skin.image ? (
                             <img
                               src={getThumbUrl(skin.image) || skin.image}
                               alt=""
                               className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                               referrerPolicy="no-referrer"
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-600"><AlertTriangle size={14}/></div>
                           )}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-100 uppercase tracking-tight group-hover:text-brand-accent transition-colors">{skin.title}</p>
                           <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-1">ID: {skin.id.substring(0,8)}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-4 md:px-8 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${skin.published ? 'bg-brand-dark border-brand-sage/20 text-brand-sage' : 'bg-brand-dark border-white/10 text-gray-500'}`}>
                          {skin.published ? <Globe size={10} /> : <Lock size={10} />}
                          {skin.published ? 'Live' : 'Hidden'}
                        </span>
                     </td>
                     <td className="px-4 md:px-8 py-4"><span className="text-[10px] font-bold uppercase text-gray-400 bg-brand-dark px-3 py-1 rounded-full border border-white/5">{skin.category}</span></td>
                     <td className="px-4 md:px-8 py-4"><p className="text-[10px] text-gray-500 font-medium">{new Date(skin.createdAt).toLocaleDateString()}</p></td>
                     <td className="px-4 md:px-8 py-4 text-right">
                       <PostActions id={skin.id} />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* PAGINATION */}
           <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Halaman {currentPage} dari {totalPages || 1}
              </span>
              <div className="flex gap-2">
                 <Link href={`/dashboard?page=${Math.max(1, currentPage - 1)}${query ? `&q=${query}` : ''}`} className="w-11 h-11 flex items-center justify-center bg-brand-dark border border-white/5 rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all" aria-label="Halaman sebelumnya">
                    <ChevronLeft size={16} />
                 </Link>
                 <Link href={`/dashboard?page=${Math.min(totalPages, currentPage + 1)}${query ? `&q=${query}` : ''}`} className="w-11 h-11 flex items-center justify-center bg-brand-dark border border-white/5 rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all" aria-label="Halaman berikutnya">
                    <ChevronRight size={16} />
                 </Link>
              </div>
           </div>
        </div>
    </div>
  );
}
