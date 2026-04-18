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
    <div className="group relative h-full flex flex-col bg-brand-onyx border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:border-brand-accent/30">
      
      {/* 1. IMAGE AREA - Rounded Top Internal */}
      <div className="relative aspect-[16/10] m-1 rounded-[12px] overflow-hidden bg-brand-dark">
        <Image 
          loader={cloudinaryLoader}
          src={skin.image || 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=600'} 
          alt={skin.title || 'Skin'} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
        
        {/* Category Pill - Floating Top Left */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-white/5 text-[10px] font-semibold text-brand-sage uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
            {skin.category}
          </span>
        </div>
      </div>

      {/* 2. TEXT CONTENT AREA */}
      <div className="px-5 pb-5 pt-3 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-100 leading-tight mb-2 group-hover:text-brand-accent transition-colors">
          {skin.title}
        </h3>
        
        <p className="text-gray-400 text-sm font-light line-clamp-2 mb-6 flex-grow leading-relaxed">
          {skin.description}
        </p>
        
        {/* 3. FOOTER ACTION */}
        <div className="flex items-center justify-between mt-auto">
          {/* Stats */}
          <div className="flex items-center gap-2 text-gray-500">
            <div className="p-1.5 rounded-full bg-white/5">
              <Download size={12} />
            </div>
            <span className="text-xs font-mono text-gray-400">{(skin.downloads || 0).toLocaleString()}</span>
          </div>
          
          {/* Action Button - Pill Shape */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 transition-all duration-300 group-hover:bg-brand-accent group-hover:text-white group-hover:shadow-[0_0_15px_rgba(224,122,95,0.4)]">
            <span className="text-[10px] uppercase font-bold tracking-widest">Inspect</span>
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
