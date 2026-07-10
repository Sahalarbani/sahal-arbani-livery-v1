"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateBlogPost } from "@/app/lib/actions";
import { ArrowLeft, Edit3, Zap, Globe, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`w-full relative bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-black text-sm py-4 md:py-5 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 group overflow-hidden ${pending ? 'opacity-70 cursor-wait' : ''}`}>
      {!pending && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
      <span className="flex items-center gap-3 relative z-10">
        {pending ? <><Loader2 size={20} className="animate-spin" /> UPDATING...</> : <><Zap size={20} strokeWidth={2.5} /> SAVE CHANGES</>}
      </span>
    </button>
  );
}

const TAG_OPTIONS = ["Tutorial", "News", "Review Visual", "Panduan Modding", "Optimasi"];

export default function EditBlogForm({ post }: { post: BlogPost }) {
  const initialState = { message: null as string | null, errors: {} as Record<string, string[]> };
  const [state, dispatch] = useActionState(updateBlogPost.bind(null, post.id), initialState);
  const isCustomTag = !TAG_OPTIONS.includes(post.tag);

  const [formData, setFormData] = useState({
    title: post.title, excerpt: post.excerpt, content: post.content, tag: post.tag, readTime: post.readTime, published: post.published,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "tagSelect") {
      if (value === "custom") setFormData(p => ({ ...p, tag: "" }));
      else setFormData(p => ({ ...p, tag: value }));
      return;
    }
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const wordCount = formData.content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Link href="/dashboard/blog" className="flex items-center gap-2 text-gray-500 hover:text-brand-accent mb-6 md:mb-8 transition-all group font-bold uppercase text-xs tracking-widest">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog Manager
      </Link>

      <div className="bg-brand-onyx border border-white/5 rounded-3xl md:rounded-[40px] p-4 md:p-10 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 md:mb-10 pl-2">
          <div className="p-3 bg-brand-accent/10 rounded-2xl border border-brand-accent/20"><Edit3 size={24} className="text-brand-accent" /></div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-100 uppercase tracking-tight">Edit Article</h1>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest mt-1 font-mono">/{post.slug}</p>
          </div>
        </div>

        <form action={dispatch} className="space-y-6 md:space-y-8">
          <div className="space-y-5 md:space-y-6 p-4 md:p-6 bg-brand-dark/50 rounded-2xl md:rounded-3xl border border-white/5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 border-l border-brand-accent pl-2 uppercase tracking-widest mb-2 ml-2">Article Title</label>
              <input name="title" type="text" value={formData.title} onChange={handleInputChange} className={`w-full bg-brand-dark border ${state.errors?.title ? 'border-red-500' : 'border-white/5'} rounded-full p-4 text-gray-100 font-bold focus:border-brand-accent focus:outline-none transition-colors text-sm`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 border-l border-brand-accent pl-2 uppercase tracking-widest mb-2 ml-2">Tag</label>
                <select name="tagSelect" defaultValue={isCustomTag ? "custom" : post.tag} onChange={handleInputChange} className="w-full bg-brand-dark border border-white/5 rounded-full p-4 text-gray-200 font-semibold text-xs focus:border-brand-accent focus:outline-none cursor-pointer appearance-none">
                  {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  <option value="custom">+ Custom</option>
                </select>
                {(isCustomTag || formData.tag === "") && <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} placeholder="TYPE TAG..." className="w-full bg-brand-accent/10 border border-brand-accent/50 rounded-full p-4 text-brand-accent font-bold uppercase tracking-widest focus:outline-none text-xs mt-2" />}
                {!isCustomTag && formData.tag !== "" && <input type="hidden" name="tag" value={formData.tag} />}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 border-l border-brand-accent pl-2 uppercase tracking-widest mb-2 ml-2">Read Time</label>
                <input name="readTime" type="text" value={estimatedReadTime} readOnly className="w-full bg-brand-dark border border-white/5 rounded-full p-4 text-gray-500 font-mono text-xs cursor-not-allowed" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-1 bg-brand-dark border border-white/5 rounded-full h-[58px]">
              <input type="hidden" name="published" value={formData.published.toString()} />
              <button type="button" onClick={() => setFormData(p => ({ ...p, published: !p.published }))} className={`flex-grow h-full flex items-center justify-center gap-2 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${formData.published ? 'bg-brand-sage/20 text-brand-sage border border-brand-sage/30' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}>
                {formData.published ? <Globe size={14} /> : <Lock size={14} />} {formData.published ? 'Publish' : 'Draft'}
              </button>
            </div>
          </div>

          <div className="space-y-5 md:space-y-6 p-4 md:p-6 bg-brand-dark/50 rounded-2xl md:rounded-3xl border border-white/5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 border-l border-brand-accent pl-2 uppercase tracking-widest mb-2 ml-2">Excerpt</label>
              <textarea name="excerpt" rows={2} value={formData.excerpt} onChange={handleInputChange} className={`w-full bg-brand-dark border ${state.errors?.excerpt ? 'border-red-500' : 'border-white/5'} rounded-2xl p-4 text-gray-300 focus:border-brand-accent focus:outline-none text-sm leading-relaxed`} />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 border-l border-brand-accent pl-2 uppercase tracking-widest mb-2 ml-2">Content (HTML)</label>
              <textarea name="content" rows={14} value={formData.content} onChange={handleInputChange} className={`w-full bg-brand-dark border ${state.errors?.content ? 'border-red-500' : 'border-white/5'} rounded-2xl p-4 text-gray-300 focus:border-brand-accent focus:outline-none font-mono text-xs leading-relaxed`} />
              <p className="text-[9px] text-gray-600 font-mono mt-2 ml-2">~{wordCount} words · {estimatedReadTime}</p>
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
  );
}
