import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Plus, Database, Activity, Clock, Box, ChevronLeft, ChevronRight, AlertTriangle, Globe, Lock } from 'lucide-react';
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

  const [totalSkins, lastSkin, allSkins, totalFiltered] = await Promise.all([
    prisma.skin.count(),
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-tight text-zinc-50 drop-shadow-sm md:text-4xl">
                    Command <span className="text-brand-accent">Center</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"/>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Operator: {session?.user?.name || 'Authorized Personnel'}
                    </p>
                </div>
            </div>
            <Link 
                href="/dashboard/create" 
                className="group relative rounded-full bg-brand-cyan px-6 py-3 text-sm font-black uppercase text-black transition-all hover:scale-105 hover:shadow-md"
            >
                <div className="flex items-center gap-2 relative z-10">
                    <Plus size={18} strokeWidth={2.5} /> Deploy Sequence
                </div>
                <div className="absolute inset-0 bg-brand-onyx/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </Link>
        </div>

        {/* STATS CARDS - BENTO STYLED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="surface-card group relative overflow-hidden p-6 transition-all hover:border-zinc-950">
             <div className="flex items-center gap-5">
                 <div className="rounded-2xl border border-white/10 bg-brand-onyx/5 p-4 text-brand-accent transition-transform group-hover:scale-110"><Box size={24} /></div>
                 <div>
                     <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Assets</p>
                     <p className="text-3xl font-black text-zinc-50">{totalSkins}</p>
                 </div>
             </div>
           </div>

           <div className="surface-card group relative overflow-hidden p-6 transition-all hover:border-zinc-950">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-brand-sage/10 rounded-2xl text-brand-sage border border-brand-sage/20 group-hover:scale-110 transition-transform"><Activity size={24} /></div>
                 <div>
                     <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">System Status</p>
                     <p className="text-3xl font-black text-brand-sage uppercase">Secure</p>
                 </div>
             </div>
           </div>

           <div className="surface-card group relative overflow-hidden p-6 transition-all hover:border-zinc-950">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform"><Clock size={24} /></div>
                 <div>
                     <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last Sync</p>
                     <p className="text-3xl font-black text-zinc-50">{timeSinceLastUpdate}</p>
                 </div>
             </div>
           </div>
        </div>

        {/* DATA TABLE - MINIMAL CONTAINER */}
        <div className="surface-card overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 bg-brand-onyx/5">
                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Asset Identity</th>
                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Visibility</th>
                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Class</th>
                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Timestamp</th>
                   <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Controls</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-200">
                 {allSkins.map((skin) => (
                   <tr key={skin.id} className="group transition-colors duration-200 hover:bg-brand-onyx/5">
                     <td className="px-8 py-4">
                       <div className="flex items-center gap-4">
                         <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-white/10 bg-brand-onyx/10">
                           {skin.image ? (
                             <img 
                               src={getThumbUrl(skin.image) || skin.image} 
                               alt="" 
                               className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                               referrerPolicy="no-referrer"
                             />
                           ) : (
                             <div className="flex h-full w-full items-center justify-center text-zinc-500"><AlertTriangle size={14}/></div>
                           )}
                         </div>
                         <div>
                           <p className="text-sm font-bold uppercase tracking-tight text-zinc-50 transition-colors group-hover:text-brand-cyan">{skin.title}</p>
                           <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500">ID: {skin.id.substring(0,8)}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-8 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${skin.published ? 'border-brand-sage/20 bg-brand-sage/10 text-brand-sage' : 'border-white/10 bg-brand-onyx/5 text-zinc-500'}`}>
                          {skin.published ? <Globe size={10} /> : <Lock size={10} />} 
                          {skin.published ? 'Live' : 'Hidden'}
                        </span>
                     </td>
                     <td className="px-8 py-4"><span className="rounded-full border border-white/10 bg-brand-onyx/5 px-3 py-1 text-[10px] font-bold uppercase text-zinc-400">{skin.category}</span></td>
                     <td className="px-8 py-4"><p className="text-[10px] font-medium text-zinc-500">{new Date(skin.createdAt).toLocaleDateString()}</p></td>
                     <td className="px-8 py-4 text-right">
                       <PostActions id={skin.id} />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* PAGINATION */}
           <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 p-6 sm:flex-row">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Displaying Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                 <Link href={`/dashboard?page=${Math.max(1, currentPage - 1)}${query ? `&q=${query}` : ''}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-onyx transition-all hover:bg-brand-cyan hover:text-black">
                    <ChevronLeft size={16} />
                 </Link>
                 <Link href={`/dashboard?page=${Math.min(totalPages, currentPage + 1)}${query ? `&q=${query}` : ''}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-onyx transition-all hover:bg-brand-cyan hover:text-black">
                    <ChevronRight size={16} />
                 </Link>
              </div>
           </div>
        </div>
    </div>
  );
}
