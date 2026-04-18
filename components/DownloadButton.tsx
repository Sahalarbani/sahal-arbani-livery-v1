"use client";

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle, FileDown } from 'lucide-react';
import { incrementDownload } from '@/app/lib/actions';

interface DownloadButtonProps {
  skinId: string;
  downloadUrl: string;
  fileName: string;
}

export function DownloadButton({ skinId, downloadUrl, fileName }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready'>('idle');

  const getForceDownloadUrl = (url: string) => {
    if (!url) return "#";
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const handleInitiate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('ready');
    }, 2000);
  };

  const handleDownload = async () => {
    // ANTI SPAM: Cek localStorage sebelum nambah angka download
    const spammed = localStorage.getItem(`download_spam_${skinId}`);
    if (!spammed) {
      await incrementDownload(skinId);
      // Kunci selama 10 menit (600.000 ms)
      localStorage.setItem(`download_spam_${skinId}`, Date.now().toString());
    } else {
      const lastTime = parseInt(spammed);
      if (Date.now() - lastTime > 600000) {
        await incrementDownload(skinId);
        localStorage.setItem(`download_spam_${skinId}`, Date.now().toString());
      }
    }
    
    const link = document.createElement('a');
    link.href = getForceDownloadUrl(downloadUrl);
    link.download = fileName || 'skin-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setStatus('idle'), 3000);
  };

  if (status === 'loading') {
    return (
      <button disabled className="w-full bg-brand-onyx border border-white/5 text-gray-400 font-bold text-sm py-4 rounded-full flex items-center justify-center gap-3 cursor-wait shadow-sm">
        <Loader2 className="animate-spin text-brand-accent" size={20} />
        <span className="tracking-[0.2em] uppercase">CONNECTING...</span>
      </button>
    );
  }

  if (status === 'ready') {
    return (
      <button 
        onClick={handleDownload}
        className="group w-full relative overflow-hidden bg-brand-sage hover:bg-brand-sage/90 text-brand-dark font-extrabold text-sm py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm animate-in zoom-in-95 hover:scale-[1.02]"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
        <FileDown className="relative z-10" strokeWidth={2.5} size={20} />
        <span className="relative z-10 tracking-[0.1em] uppercase">SECURE DOWNLOAD</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleInitiate}
      className="group w-full relative overflow-hidden bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-extrabold text-sm py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-95"
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
      <Download className="relative z-10 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} size={20} />
      <span className="relative z-10 tracking-[0.15em] uppercase">ACQUIRE ASSET</span>
    </button>
  );
}
