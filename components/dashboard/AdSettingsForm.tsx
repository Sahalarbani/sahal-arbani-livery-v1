"use client";

import { useState } from "react";
import { updateAdSettings } from "@/lib/actions/ads";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdSettingsFormProps {
  initialSettings: any;
}

export function AdSettingsForm({ initialSettings }: AdSettingsFormProps) {
  const [publisherId, setPublisherId] = useState(initialSettings?.publisherId || "");
  const [slotHome, setSlotHome] = useState(initialSettings?.slotHome || "");
  const [slotDetail, setSlotDetail] = useState(initialSettings?.slotDetail || "");
  const [slotBlog, setSlotBlog] = useState(initialSettings?.slotBlog || "");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateAdSettings({
      publisherId,
      slotHome,
      slotDetail,
      slotBlog
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'AdSense Configuration Synced Successfully' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-brand-onyx border border-white/5 rounded-3xl p-6 md:p-10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent text-sm">01</span>
            Publisher Identity
          </h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Google Publisher ID (ca-pub-xxx)</label>
            <input
              type="text"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
            />
          </div>
        </div>

        <div className="bg-brand-onyx border border-white/5 rounded-3xl p-6 md:p-10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent text-sm">02</span>
            Slot Configurations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Home Feed Slot</label>
              <input
                type="text"
                value={slotHome}
                onChange={(e) => setSlotHome(e.target.value)}
                placeholder="Ex: 1234567890"
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Detail Page Slot</label>
              <input
                type="text"
                value={slotDetail}
                onChange={(e) => setSlotDetail(e.target.value)}
                placeholder="Ex: 1234567890"
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Blog Articles Slot</label>
              <input
                type="text"
                value={slotBlog}
                onChange={(e) => setSlotBlog(e.target.value)}
                placeholder="Ex: 1234567890"
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-brand-sage/10 text-brand-sage border border-brand-sage/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-bold uppercase tracking-wide">{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-4 bg-brand-accent text-brand-dark font-black uppercase text-sm rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-brand-accent/20"
        >
          {loading ? "Syncing..." : "Update Ad Configuration"}
          <Save size={18} />
        </button>
      </form>

      <div className="mt-12 p-6 bg-brand-accent/5 border border-brand-accent/10 rounded-2xl">
         <h4 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3 flex items-center gap-2 italic">
            <AlertCircle size={14} /> Documentation Note
         </h4>
         <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Changes applied here will automatically update all AdSense tags across the Sahal Arbani ecosystem. 
            Ensure your <code className="text-brand-accent bg-brand-accent/10 px-1 rounded mx-1">ads.txt</code> is correctly configured in the root directory for maximum fill rates.
         </p>
      </div>
    </div>
  );
}
