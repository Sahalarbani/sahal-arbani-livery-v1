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
          <h1 className="text-2xl md:text-3xl font-black text-gray-100 uppercase tracking-tight">Komentar</h1>
          <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
            Memonitor interaksi pengguna
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="CARI KOMENTAR..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent rounded-full py-3 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
            />
        </div>
      </div>

      <div className="flex-1 bg-brand-dark/50 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4">
              <div className="flex flex-col gap-3">
                  {filteredComments.length === 0 ? (
                      <div className="text-center py-20 text-gray-500 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-3">
                         <MessageSquare size={32} className="opacity-20"/>
                         Tidak ada data
                      </div>
                  ) : filteredComments.map((comment) => (
                      <div key={comment.id} className="bg-brand-onyx border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center transition-all hover:border-white/10 group">
                          
                          <div className="flex items-center gap-4 flex-none lg:w-[250px] overflow-hidden">
                             <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden flex-shrink-0">
                                {comment.userImage ? (
                                    <img src={comment.userImage} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-brand-dark flex items-center justify-center text-gray-500 font-bold text-xs">
                                      {comment.userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                             </div>
                             <div className="min-w-0">
                                 <p className="font-bold text-sm text-gray-200 truncate">{comment.userName}</p>
                                 <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-wider mt-0.5"><Clock size={10}/> {formatDistanceToNow(new Date(comment.createdAt), {addSuffix:true})}</p>
                             </div>
                          </div>

                          <div className="flex-1 min-w-0">
                              <p className="text-gray-300 text-sm italic border-l-2 border-brand-accent/30 pl-3">"{comment.content}"</p>
                          </div>

                          <div className="flex items-center gap-2 lg:w-[250px] justify-between flex-none mt-2 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                             <Link href={`/skin/${comment.skinId}`} target="_blank" className="text-[10px] font-bold text-brand-accent/80 hover:text-brand-accent uppercase tracking-widest flex items-center gap-1.5 truncate pr-2 max-w-[150px]">
                                <MapPin size={12} className="flex-shrink-0"/> {comment.skin.title}
                             </Link>

                             <button 
                                onClick={() => handleDelete(comment.id)}
                                disabled={isPending}
                                className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
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
