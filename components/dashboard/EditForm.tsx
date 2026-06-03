"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSkin } from "@/app/lib/actions";
import { Edit3, Zap, Globe, Lock, ImageIcon, FolderOpen, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
        type="submit"
        disabled={pending}
        className={`group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-zinc-950 py-4 text-lg font-black text-white shadow-lg transition-all hover:bg-brand-cyan md:py-5 ${pending ? 'cursor-wait opacity-70' : 'hover:scale-[1.01]'}`}
    >
      {!pending && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>}
      <span className="flex items-center gap-3 relative z-10 tracking-[0.1em]">
        {pending ? <><Loader2 size={24} className="animate-spin" /> SYNCHRONIZING...</> : <><Zap size={24} strokeWidth={2.5} /> CONFIRM UPDATE</>}
      </span>
    </button>
  );
}

export default function EditForm({ skin }: { skin: any }) {
  const updateSkinWithId = updateSkin.bind(null, skin.id);
  const [state, dispatch] = useActionState(updateSkinWithId, { message: null, errors: {} });

  const [formData, setFormData] = useState({
    title: skin.title,
    description: skin.description,
    image: skin.image,
    category: skin.category,
    published: skin.published,
    downloadUrl: skin.downloadUrl
  });

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? e.target.checked : value }));
  };

  const openWidget = (targetField: 'image' | 'downloadUrl') => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
        sources: ["cloudinary", "local", "url"],
        multiple: false,
        resourceType: targetField === 'image' ? 'image' : 'auto',
        folder: "arbskin_uploads",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
           setFormData((prev: any) => ({ ...prev, [targetField]: result.info.secure_url }));
        }
      }
    );
    widget.open();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 w-full">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" />

      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-3 px-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-950 md:mb-8 group">
        <div className="rounded-full bg-white p-2 transition-colors group-hover:bg-zinc-100">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        Cancel Sequence
      </Link>

      <div className="surface-card relative overflow-hidden rounded-3xl p-4 md:rounded-[32px] md:p-12">

        <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12 relative z-10">
          <div className="p-3 md:p-4 bg-brand-accent/10 rounded-2xl border border-brand-accent/20 text-brand-accent">
            <Edit3 size={24} className="md:w-7 md:h-7" />
          </div>
          <div className="overflow-hidden">
            <h1 className="truncate text-xl font-black uppercase tracking-tight text-zinc-950 md:text-3xl">Edit Sequence</h1>
            <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Asset ID: <span className="font-mono text-brand-accent">{skin.id.substring(0,8)}</span>
            </p>
          </div>
        </div>

        <form action={dispatch} className="space-y-6 md:space-y-8 relative z-10">
            <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:space-y-6 md:rounded-[32px] md:p-8">
                <div>
                    <label className="mb-2 ml-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 md:mb-3 md:ml-4">Asset Designation</label>
                    <input
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold tracking-wide text-zinc-950 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-brand-cyan md:rounded-full md:px-6 md:py-4 md:text-lg"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="mb-2 ml-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 md:mb-3 md:ml-4">Classification</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold tracking-wide text-zinc-950 outline-none transition-all focus:border-brand-cyan md:px-6 md:py-4"
                            >
                                <option value="street">Street</option>
                                <option value="racing">Racing</option>
                                <option value="drift">Drift</option>
                                <option value="rally">Rally</option>
                                <option value="custom">Custom</option>
                            </select>
                            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">▼</div>
                        </div>
                    </div>
                    <div>
                      <label className="mb-2 ml-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 md:mb-3 md:ml-4">Visibility</label>
                      <div className="flex h-[50px] items-center rounded-full border border-zinc-200 bg-white p-1 md:h-[60px]">
                        <input type="hidden" name="published" value={formData.published.toString()} />
                        <button
                            type="button"
                            onClick={() => setFormData((p: any) => ({ ...p, published: !p.published }))}
                            className={`flex h-full flex-grow items-center justify-center gap-2 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 md:gap-3 md:text-xs ${formData.published ? 'bg-brand-sage text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-950'}`}
                        >
                          {formData.published ? <Globe size={14} className="md:w-4 md:h-4" /> : <Lock size={14} className="md:w-4 md:h-4" />}
                          {formData.published ? 'Public Access' : 'Private'}
                        </button>
                      </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:space-y-6 md:rounded-[32px] md:p-8">
                 <div>
                    <label className="mb-2 ml-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 md:mb-3 md:ml-4">Visual Source URL</label>
                    <div className="flex gap-2 md:gap-3">
                        <input
                            name="image"
                            type="text"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="w-0 flex-grow rounded-full border border-zinc-200 bg-white px-5 py-3 font-mono text-[10px] text-zinc-700 outline-none transition-all focus:border-brand-cyan md:px-6 md:py-4 md:text-xs"
                        />
                        <button
                            type="button"
                            onClick={() => openWidget('image')}
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-brand-accent transition-all duration-300 hover:bg-zinc-950 hover:text-white md:h-14 md:w-14"
                        >
                            <ImageIcon size={18} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                 </div>

                 <div>
                    <label className="mb-2 ml-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 md:mb-3 md:ml-4">Technical Description</label>
                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full resize-none rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-700 outline-none transition-all duration-300 focus:border-brand-cyan md:rounded-3xl md:p-6"
                    />
                 </div>

                 <div>
                    <label className="mb-2 ml-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 md:mb-3 md:ml-4">Data Uplink (Download Link)</label>
                    <div className="flex gap-2 md:gap-3">
                        <input
                            name="downloadUrl"
                            type="text"
                            value={formData.downloadUrl}
                            onChange={handleInputChange}
                            className="w-0 flex-grow rounded-full border border-zinc-200 bg-white px-5 py-3 font-mono text-[10px] text-zinc-700 outline-none transition-all focus:border-brand-cyan md:px-6 md:py-4 md:text-xs"
                        />
                        <button
                            type="button"
                            onClick={() => openWidget('downloadUrl')}
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-brand-accent transition-all duration-300 hover:bg-zinc-950 hover:text-white md:h-14 md:w-14"
                        >
                            <FolderOpen size={18} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                 </div>
            </div>

            {state?.message && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Error: {state.message}
                </div>
            )}

            <SubmitButton />
        </form>
      </div>
    </div>
  );
}
