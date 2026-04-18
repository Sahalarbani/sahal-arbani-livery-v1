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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 uppercase tracking-tight drop-shadow-sm">
                    Command <span className="text-brand-accent">Center</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"/>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                        Operator: {session?.user?.name || 'Authorized Personnel'}
                    </p>
                </div>
            </div>
            <Link 
                href="/dashboard/create" 
                className="group relative px-6 py-3 bg-brand-accent text-brand-dark font-black uppercase text-sm rounded-full transition-all hover:shadow-md hover:scale-105"
            >
                <div className="flex items-center gap-2 relative z-10">
                    <Plus size={18} strokeWidth={2.5} /> Deploy Sequence
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </Link>
        </div>

        {/* STATS CARDS - BENTO STYLED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="relative p-6 bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden group hover:bg-brand-onyx/80 transition-all">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-brand-accent/10 rounded-2xl text-brand-accent border border-brand-accent/20 group-hover:scale-110 transition-transform"><Box size={24} /></div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Assets</p>
                     <p className="text-3xl font-black text-gray-100">{totalSkins}</p>
                 </div>
             </div>
           </div>

           <div className="relative p-6 bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden group hover:bg-brand-onyx/80 transition-all">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-brand-sage/10 rounded-2xl text-brand-sage border border-brand-sage/20 group-hover:scale-110 transition-transform"><Activity size={24} /></div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">System Status</p>
                     <p className="text-3xl font-black text-brand-sage uppercase">Secure</p>
                 </div>
             </div>
           </div>

           <div className="relative p-6 bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden group hover:bg-brand-onyx/80 transition-all">
             <div className="flex items-center gap-5">
                 <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform"><Clock size={24} /></div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Sync</p>
                     <p className="text-3xl font-black text-gray-100">{timeSinceLastUpdate}</p>
                 </div>
             </div>
           </div>
        </div>

        {/* DATA TABLE - MINIMAL CONTAINER */}
        <div className="bg-brand-onyx border border-white/5 rounded-[24px] overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-brand-dark/50 border-b border-white/5">
                   <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Asset Identity</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Visibility</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Class</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Timestamp</th>
                   <th className="px-8 py-5 text-right text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Controls</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {allSkins.map((skin) => (
                   <tr key={skin.id} className="group hover:bg-brand-dark/30 transition-colors duration-200">
                     <td className="px-8 py-4">
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
                     <td className="px-8 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${skin.published ? 'bg-brand-sage/10 border-brand-sage/20 text-brand-sage' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {skin.published ? <Globe size={10} /> : <Lock size={10} />} 
                          {skin.published ? 'Live' : 'Hidden'}
                        </span>
                     </td>
                     <td className="px-8 py-4"><span className="text-[10px] font-bold uppercase text-gray-400 bg-brand-dark px-3 py-1 rounded-full border border-white/5">{skin.category}</span></td>
                     <td className="px-8 py-4"><p className="text-[10px] text-gray-500 font-medium">{new Date(skin.createdAt).toLocaleDateString()}</p></td>
                     <td className="px-8 py-4 text-right">
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
                Displaying Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                 <Link href={`/dashboard?page=${Math.max(1, currentPage - 1)}${query ? `&q=${query}` : ''}`} className="w-10 h-10 flex items-center justify-center bg-brand-dark border border-white/5 rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all">
                    <ChevronLeft size={16} />
                 </Link>
                 <Link href={`/dashboard?page=${Math.min(totalPages, currentPage + 1)}${query ? `&q=${query}` : ''}`} className="w-10 h-10 flex items-center justify-center bg-brand-dark border border-white/5 rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all">
                    <ChevronRight size={16} />
                 </Link>
              </div>
           </div>
        </div>
    </div>
  );
}
