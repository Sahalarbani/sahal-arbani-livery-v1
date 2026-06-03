import React, { useEffect, useState } from "react";
import { X, Image as ImageIcon, Loader2, Check } from "lucide-react";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function ImageGalleryModal({ isOpen, onClose, onSelect }: ImageGalleryModalProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getThumbnailUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    return url.replace("/upload/", "/upload/w_400,c_scale,f_auto,q_auto/");
  };

  if (!isOpen) return null;

  return (
    // OVERLAY: Lebih soft dengan blur
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* MODAL CONTAINER: Super Rounded & Glass */}
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-brand-onyx shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 bg-brand-onyx px-8 py-6">
          <h3 className="text-brand-accent font-bold uppercase tracking-widest flex items-center gap-3 text-lg">
            <div className="p-2 rounded-full bg-brand-accent/10">
              <ImageIcon size={20} />
            </div>
            Media Library ({images.length})
          </h3>
          <button 
            onClick={onClose} 
            className="rounded-full border border-white/10 bg-brand-onyx p-2 text-zinc-500 transition-all duration-300 hover:rotate-90 hover:bg-red-50 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-60 gap-4">
              <Loader2 className="animate-spin text-brand-accent" size={40} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 animate-pulse">
                Establishing Cloud Uplink...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div 
                  key={img.public_id} 
                  onClick={() => { 
                    onSelect(img.secure_url);
                    onClose(); 
                  }}
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-brand-onyx/10 transition-all duration-300 hover:scale-[1.03] hover:border-brand-accent/50"
                >
                  <img 
                    src={getThumbnailUrl(img.secure_url)} 
                    alt="asset" 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                       <Check className="text-brand-dark" size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* FOOTER HINT */}
        <div className="border-t border-white/10 bg-brand-onyx/5 px-8 py-4 text-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Select an asset to attach to matrix</span>
        </div>
      </div>
    </div>
  );
}
