"use client";

import React from 'react';
import { Skin } from '../types';
import Link from 'next/link';
import { Eye, Download } from 'lucide-react'; // Menggunakan icon Lucide agar konsisten

import Image from 'next/image';
import cloudinaryLoader from '@/lib/cloudinary-loader';

interface SkinCardProps {
  skin: Skin;
  onClick?: () => void;
  href?: string;
}

export const SkinCard: React.FC<SkinCardProps> = ({ skin, onClick, href }) => {
  
  // LOGIC & CONTENT WRAPPER
  const CardContent = (
    <div className="glass-panel group relative flex h-full flex-col overflow-hidden rounded-[22px] p-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-cyan/30 hover:shadow-halo">
      
      {/* 1. IMAGE AREA - Rounded Top Internal */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-brand-dark">
        <Image 
          loader={cloudinaryLoader}
          src={skin.image || 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=600'} 
          alt={skin.title || 'Skin'} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-80" />
        
        {/* Category Pill - Floating Top Left */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-cyan shadow-sm backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_12px_rgba(114,230,255,0.8)]" />
            {skin.category}
          </span>
        </div>
      </div>

      {/* 2. TEXT CONTENT AREA */}
      <div className="flex flex-grow flex-col px-4 pb-4 pt-4">
        <h3 className="mb-2 text-lg font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-brand-cyan">
          {skin.title}
        </h3>
        
        <p className="mb-6 line-clamp-2 flex-grow text-sm font-medium leading-relaxed text-slate-400">
          {skin.description}
        </p>
        
        {/* 3. FOOTER ACTION */}
        <div className="flex items-center justify-between mt-auto">
          {/* Stats */}
          <div className="flex items-center gap-2 text-slate-500">
            <div className="rounded-full border border-white/10 bg-white/10 p-1.5">
              <Download size={12} />
            </div>
            <span className="font-mono text-xs text-slate-400">{(skin.downloads || 0).toLocaleString()}</span>
          </div>
          
          {/* Action Button - Pill Shape */}
          <div className="flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-4 py-1.5 text-brand-cyan transition-all duration-300 group-hover:bg-brand-cyan group-hover:text-brand-dark">
            <span className="text-[10px] font-black uppercase tracking-[0.16em]">Open</span>
            <Eye size={14} />
          </div>
        </div>
      </div>
    </div>
  );

  // WRAPPER LOGIC (Link vs Div)
  const containerClasses = "block h-full w-full focus:outline-none";

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {CardContent}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={`${containerClasses} cursor-pointer`}>
      {CardContent}
    </div>
  );
};
