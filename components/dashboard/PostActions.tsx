"use client";

import React, { useState } from 'react';
import { Trash2, Edit3, Loader2 } from 'lucide-react';
import { deleteSkin } from '@/app/lib/actions';
import Link from 'next/link'; // ✅ WAJIB IMPORT INI

interface PostActionsProps {
  id: string;
}

export const PostActions: React.FC<PostActionsProps> = ({ id }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("CONFIRM DESTRUCTIVE ACTION: PERMANENTLY DELETE ASSET?")) {
      setIsDeleting(true);
      try {
        await deleteSkin(id);
      } catch (err) {
        alert("Action failed: Internal system error.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {/* ✅ FIX: Ganti Button jadi Link */}
      <Link 
        href={`/dashboard/edit/${id}`}
        className="flex items-center justify-center rounded-md border border-zinc-200 bg-white p-2 text-zinc-500 transition-all hover:bg-zinc-950 hover:text-white"
        title="Edit Parameters"
      >
        <Edit3 size={16} />
      </Link>
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all rounded-sm disabled:opacity-50"
        title="Terminate Asset"
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
};
