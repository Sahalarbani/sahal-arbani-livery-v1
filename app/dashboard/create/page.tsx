"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createSkin } from "@/app/lib/actions";
import { ArrowLeft, Edit3, Zap, Globe, Lock, Link as LinkIcon, ImageIcon, Plus, FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { SkinCard } from "@/components/SkinCard";
import { Skin } from "@/types";
import Script from "next/script";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import PresetSelector from "@/components/PresetSelector"; 

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-brand-cyan py-4 text-xl font-black text-black shadow-lg transition-all hover:bg-brand-cyan md:py-6 ${pending ? 'cursor-wait opacity-70' : ''}`}>
      {!pending && <div className="absolute inset-0 bg-brand-onyx/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
      <span className="flex items-center gap-3 md:gap-4 relative z-10 text-sm md:text-xl">
        {pending ? <><Loader2 size={24} className="animate-spin" /> INITIALIZING...</> : <><Zap size={24} strokeWidth={2.5} className="md:w-7 md:h-7" /> FINALIZE DEPLOYMENT</>}
      </span>
    </button>
  );
}

const ErrorMessage = ({ error }: { error?: string[] }) => (
  error ? <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {error[0]}</p> : null
);

export default function CreateSkinPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createSkin, initialState);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [targetField, setTargetField] = useState<'image' | 'downloadUrl'>('image');

  const [formData, setFormData] = useState({
    title: "", description: "", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2670&auto=format&fit=crop",
    category: "street", published: true, downloadUrl: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "categorySelect") {
      if (value === "custom") { setIsCustomCategory(true); setFormData(p => ({ ...p, category: "" })); }
      else { setIsCustomCategory(false); setFormData(p => ({ ...p, category: value })); }
      return;
    }
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const openUploadWidget = (field: 'image' | 'downloadUrl') => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
        sources: ["local", "url", "camera"],
        multiple: false,
        resourceType: field === 'image' ? 'image' : 'auto',
        folder: "arbskin_uploads",
        styles: { palette: { window: "#141414", sourceBg: "#1F1F1F", windowBorder: "#E07A5F", tabIcon: "#E07A5F", inactiveTabIcon: "#8F9779", menuIcons: "#E07A5F", link: "#E07A5F", action: "#E07A5F", inProgress: "#E07A5F", complete: "#8F9779", error: "#cc0000", textDark: "#141414", textLight: "#F5F5F4" } },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") { setFormData(prev => ({ ...prev, [field]: result.info.secure_url })); }
      }
    );
    widget.open();
  };

  const openGallery = (field: 'image' | 'downloadUrl') => { setTargetField(field); setIsGalleryOpen(true); };

  const previewSkin: Skin = {
    id: "PREVIEW", title: formData.title || "Target Asset Designation", description: formData.description || "Briefing...",
    image: formData.image, downloadUrl: formData.downloadUrl || "#", category: formData.category || "UNCLASSIFIED",
    author: "Active Operator", downloads: 0, createdAt: new Date().toISOString(),
  };

  // FIX: Padding tombol dikecilin di mobile (px-3) biar muat
  const buttonStyle = "h-[50px] px-3 md:px-6 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all flex items-center gap-2 md:gap-3 border border-white/10 bg-brand-onyx text-zinc-300 hover:bg-brand-cyan hover:text-black hover:border-zinc-950 active:scale-95 whitespace-nowrap";

  return (
    <div className="w-full">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" />
      <ImageGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} onSelect={(url) => setFormData(prev => ({ ...prev, [targetField]: url }))} />

      <div className="max-w-[1440px] mx-auto">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-all hover:text-zinc-50 md:mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Abort Deployment
        </Link>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          <div className="lg:w-7/12 space-y-8">
            <div className="surface-card relative overflow-hidden rounded-3xl p-4 md:rounded-[32px] md:p-10">
              
              <div className="flex items-center gap-4 mb-6 md:mb-10 pl-2">
                <div className="p-3 bg-brand-accent/10 rounded-2xl border border-brand-accent/20"><Edit3 size={24} className="text-brand-accent" /></div>
                <div className="overflow-hidden">
                    <h1 className="truncate text-xl font-black uppercase tracking-tight text-zinc-50 md:text-3xl">Sequence Editor</h1>
                    <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Initialize New Asset</p>
                </div>
              </div>

              <form action={dispatch} className="space-y-6 md:space-y-8">
                {/* Section 1 */}
                <div className="space-y-5 rounded-2xl border border-white/10 bg-brand-onyx/5 p-4 md:space-y-6 md:rounded-3xl md:p-6">
                  <div>
                    <label className="mb-2 ml-2 block border-l border-brand-accent pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:mb-3">Asset Designation</label>
                    <input name="title" type="text" placeholder="e.g. NEON VORTEX LIVERY" value={formData.title} onChange={handleInputChange} className={`w-full rounded-full border bg-brand-onyx p-4 text-sm font-bold uppercase tracking-widest text-zinc-50 transition-colors placeholder:text-zinc-600 focus:border-brand-cyan focus:outline-none md:text-base ${state.errors?.title ? 'border-red-500 animate-pulse' : 'border-white/10'}`} />
                    <ErrorMessage error={state.errors?.title} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="mb-2 ml-2 block border-l border-brand-accent pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:mb-3">Classification</label>
                      <select name="categorySelect" onChange={handleInputChange} className="mb-2 w-full cursor-pointer appearance-none rounded-full border border-white/10 bg-brand-onyx p-4 text-xs font-semibold uppercase tracking-widest text-zinc-50 focus:border-brand-cyan focus:outline-none md:text-sm">
                        <option value="street">Street Division</option>
                        <option value="racing">Racing Division</option>
                        <option value="drift">Drift Division</option>
                        <option value="rally">Rally Division</option>
                        <option value="custom">+ Input Manual</option>
                      </select>
                      {isCustomCategory && (<div className="relative animate-in fade-in slide-in-from-top-2"><input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="TYPE CUSTOM..." className={`w-full bg-brand-accent/10 border ${state.errors?.category ? 'border-red-500' : 'border-brand-accent/50'} rounded-full p-4 text-brand-accent font-bold uppercase tracking-widest focus:outline-none text-xs md:text-sm`} /><Plus size={16} className="absolute right-4 top-4 text-brand-accent" /></div>)}
                      {!isCustomCategory && <input type="hidden" name="category" value={formData.category} />}
                      <ErrorMessage error={state.errors?.category} />
                    </div>
                    <div>
                      <label className="mb-2 ml-2 block border-l border-brand-accent pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:mb-3">Transmission</label>
                      <div className="flex h-[58px] items-center gap-4 rounded-full border border-white/10 bg-brand-onyx p-1 md:p-1">
                        <input type="hidden" name="published" value={formData.published.toString()} />
                        <button type="button" onClick={() => setFormData(p => ({ ...p, published: !p.published }))} className={`flex h-full flex-grow items-center justify-center gap-2 rounded-full px-4 text-[10px] font-bold uppercase tracking-widest transition-all ${formData.published ? 'border border-brand-sage/30 bg-brand-sage/10 text-brand-sage' : 'bg-transparent text-zinc-500 hover:text-zinc-50'}`}>
                          {formData.published ? <Globe size={14} /> : <Lock size={14} />} {formData.published ? 'Public' : 'Private'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-5 rounded-2xl border border-white/10 bg-brand-onyx/5 p-4 md:space-y-6 md:rounded-3xl md:p-6">
                  <div>
                    <label className="mb-2 ml-2 block border-l border-brand-accent pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:mb-3">Visual Source (Preview)</label>
                    {/* FIX: gap-2 biar rapet di HP. Input dikasih min-w-0 biar bisa mengecil */}
                    <div className="flex gap-2 md:gap-4 items-center">
                      <input name="image" type="text" placeholder="URL..." value={formData.image} onChange={handleInputChange} className={`h-[50px] min-w-0 flex-grow rounded-full border bg-brand-onyx p-4 font-mono text-[10px] text-zinc-400 focus:border-brand-cyan focus:outline-none md:text-xs ${state.errors?.image ? 'border-red-500' : 'border-white/10'}`} />
                      <button type="button" onClick={() => openUploadWidget('image')} className={`${buttonStyle} flex-shrink-0`}><FolderOpen size={16} /> <span className="hidden sm:inline">NEW</span></button>
                      <button type="button" onClick={() => openGallery('image')} className={`${buttonStyle} flex-shrink-0`}><ImageIcon size={16} /> <span className="hidden sm:inline">LIBRARY</span></button>
                    </div>
                    <ErrorMessage error={state.errors?.image} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 ml-2">
                       <label className="mb-2 block border-l border-brand-accent pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:mb-3">Description</label>
                    </div>
                    <PresetSelector currentDescription={formData.description} onSelect={(val) => setFormData(prev => ({ ...prev, description: val }))} />
                     
                    <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className={`mt-2 w-full rounded-2xl border bg-brand-onyx p-4 text-sm leading-relaxed text-zinc-300 focus:border-brand-cyan focus:outline-none md:rounded-3xl ${state.errors?.description ? 'border-red-500' : 'border-white/10'}`} />
                    <ErrorMessage error={state.errors?.description} />
                  </div>

                  <div>
                     <label className="mb-2 ml-2 block border-l border-brand-accent pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:mb-3">Payload (Download Link)</label>
                    {/* FIX: gap-2 & min-w-0 */}
                    <div className="flex gap-2 md:gap-4 items-center">
                      <input name="downloadUrl" type="text" placeholder="Link..." value={formData.downloadUrl} onChange={handleInputChange} className={`h-[50px] min-w-0 flex-grow rounded-full border bg-brand-onyx p-4 font-mono text-[10px] text-zinc-300 focus:border-brand-cyan focus:outline-none md:text-xs ${state.errors?.downloadUrl ? 'border-red-500' : 'border-white/10'}`} />
                      <button type="button" onClick={() => openUploadWidget('downloadUrl')} className={`${buttonStyle} flex-shrink-0`}><FolderOpen size={16} /> <span className="hidden sm:inline">UPLOAD</span></button>
                      <button type="button" onClick={() => openGallery('downloadUrl')} className={`${buttonStyle} flex-shrink-0`}><ImageIcon size={16} /> <span className="hidden sm:inline">LIBRARY</span></button>
                    </div>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, downloadUrl: prev.image }))} className="ml-2 mt-3 flex cursor-pointer items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-brand-accent group"><LinkIcon size={12} className="transition-transform group-hover:rotate-45" />[USE IMAGE SOURCE]</button>
                    <ErrorMessage error={state.errors?.downloadUrl} />
                  </div>
                </div>

                {state.message && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {state.message}
                  </div>
                )}
                <SubmitButton />
              </form>
            </div>
          </div>
          <div className="lg:w-5/12"><div className="sticky top-28"><SkinCard skin={previewSkin} /></div></div>
        </div>
      </div>
    </div>
  );
}
