"use client";

import React, { useState } from "react";
import { deleteCommentAction } from "@/app/lib/admin-actions";
import { MessageSquare, Trash2, Clock, MapPin, Search } from "lucide-react";
import { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function CommentsClient({ initialComments }: { initialComments: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState(initialComments);

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(search.toLowerCase()) || 
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if(!confirm("Hapus komentar ini selamanya?")) return;
    
    startTransition(async () => {
       const res = await deleteCommentAction(id);
       if(res.success) {
         setComments(prev => prev.filter(c => c.id !== id));
       }
    });
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-50 md:text-3xl">Komentar</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:text-xs">
            Memonitor interaksi pengguna
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="CARI KOMENTAR..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-brand-onyx py-3 pl-10 pr-4 text-xs text-zinc-50 placeholder:text-zinc-600 transition-colors focus:border-brand-cyan focus:outline-none"
            />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-brand-onyx">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4">
              <div className="flex flex-col gap-3">
                  {filteredComments.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 py-20 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                         <MessageSquare size={32} className="opacity-20"/>
                         Tidak ada data
                      </div>
                  ) : filteredComments.map((comment) => (
                      <div key={comment.id} className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-brand-onyx p-4 transition-all hover:border-zinc-950 lg:flex-row lg:items-center">
                          
                          <div className="flex items-center gap-4 flex-none lg:w-[250px] overflow-hidden">
                             <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
                                {comment.userImage ? (
                                    <img src={comment.userImage} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-brand-onyx/10 text-xs font-bold text-zinc-500">
                                      {comment.userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                             </div>
                             <div className="min-w-0">
                                 <p className="truncate text-sm font-bold text-zinc-50">{comment.userName}</p>
                                 <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-500"><Clock size={10}/> {formatDistanceToNow(new Date(comment.createdAt), {addSuffix:true})}</p>
                             </div>
                          </div>

                          <div className="flex-1 min-w-0">
                              <p className="border-l-2 border-brand-accent/30 pl-3 text-sm italic text-zinc-400">"{comment.content}"</p>
                          </div>

                          <div className="mt-2 flex flex-none items-center justify-between gap-2 border-t border-white/10 pt-3 lg:mt-0 lg:w-[250px] lg:border-t-0 lg:pt-0">
                             <Link href={`/skin/${comment.skinId}`} target="_blank" className="text-[10px] font-bold text-brand-accent/80 hover:text-brand-accent uppercase tracking-widest flex items-center gap-1.5 truncate pr-2 max-w-[150px]">
                                <MapPin size={12} className="flex-shrink-0"/> {comment.skin.title}
                             </Link>

                             <button 
                                onClick={() => handleDelete(comment.id)}
                                disabled={isPending}
                                className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 hover:bg-red-500 hover:text-black transition-colors disabled:opacity-50"
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
