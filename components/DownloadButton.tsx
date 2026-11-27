"use client";

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { incrementDownload } from '@/app/lib/actions';

interface DownloadButtonProps {
  skinId: string;
  downloadUrl: string;
  fileName: string;
}

// B3: satu langkah yang jujur. Tombol lama berpura-pura "menghubungkan"
// selama 2 detik (setTimeout) sebelum menampilkan tombol kedua, dan
// target unduhan tidak terlihat di DOM — QC tidak bisa memverifikasinya.
// Sekarang: satu klik langsung mengunduh (dengan status loading nyata
// selama incrementDownload berjalan), dan ada tautan langsung yang
// terlihat di bawah tombol sebagai fallback yang dapat diperiksa.
export function DownloadButton({ skinId, downloadUrl, fileName }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'downloaded'>('idle');

  const getForceDownloadUrl = (url: string) => {
    if (!url) return "#";
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const handleDownload = async () => {
    if (status === 'downloading') return;
    setStatus('downloading');
    try {
      // Anti spam: hitung unduhan maks. 1x per 10 menit per skin.
      const spammed = localStorage.getItem(`download_spam_${skinId}`);
      const lastTime = spammed ? parseInt(spammed) : 0;
      if (!spammed || Date.now() - lastTime > 600000) {
        await incrementDownload(skinId);
        localStorage.setItem(`download_spam_${skinId}`, Date.now().toString());
      }
    } catch {
      // Unduhan tetap jalan walau pencatatan gagal.
    }

    const link = document.createElement('a');
    link.href = getForceDownloadUrl(downloadUrl);
    link.download = fileName || 'skin-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatus('downloaded');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={status === 'downloading' || !downloadUrl}
        title={downloadUrl ? `Download ${fileName}` : 'Download not available'}
        className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-60 text-brand-dark font-extrabold text-sm py-4 rounded-full transition-colors flex items-center justify-center gap-3 active:scale-95"
      >
        {status === 'downloading' ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span className="tracking-[0.15em] uppercase">Downloading...</span>
          </>
        ) : status === 'downloaded' ? (
          <>
            <CheckCircle size={20} />
            <span className="tracking-[0.15em] uppercase">Downloaded</span>
          </>
        ) : (
          <>
            <Download strokeWidth={2.5} size={20} />
            <span className="tracking-[0.15em] uppercase">Download</span>
          </>
        )}
      </button>
      {downloadUrl && (
        <a
          href={getForceDownloadUrl(downloadUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs text-gray-500 hover:text-brand-accent transition-colors break-all"
        >
          Direct download link
        </a>
      )}
    </div>
  );
}
