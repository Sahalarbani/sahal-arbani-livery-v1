/**
 * CHANGELOG
 * Version: 2.2.0
 * Date: 2026-04-25
 * Description: UI Upgrade dengan Global Kill-Switch, Auto-Sanitization, dan Download Slot.
 */

"use client";

import { useState } from "react";
import { updateAdSettings } from "@/lib/actions/ads";
import { Save, AlertCircle, CheckCircle2, Power, PowerOff } from "lucide-react";

interface AdSettingsFormProps {
  initialSettings: any;
}

export function AdSettingsForm({ initialSettings }: AdSettingsFormProps) {
  const [publisherId, setPublisherId] = useState(initialSettings?.publisherId || "");
  const [isAdsActive, setIsAdsActive] = useState<boolean>(initialSettings?.isAdsActive ?? true);
  
  const [slotHome, setSlotHome] = useState(initialSettings?.slotHome || "");
  const [slotDetail, setSlotDetail] = useState(initialSettings?.slotDetail || "");
  const [slotBlog, setSlotBlog] = useState(initialSettings?.slotBlog || "");
  const [slotDownload, setSlotDownload] = useState(initialSettings?.slotDownload || "");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Auto-Sanitization: Menghilangkan spasi kosong dari copy-paste HP
    const cleanPublisherId = publisherId.trim();
    const cleanSlotHome = slotHome.trim();
    const cleanSlotDetail = slotDetail.trim();
    const cleanSlotBlog = slotBlog.trim();
    const cleanSlotDownload = slotDownload.trim();

    const result = await updateAdSettings({
      publisherId: cleanPublisherId,
      isAdsActive,
      slotHome: cleanSlotHome,
      slotDetail: cleanSlotDetail,
      slotBlog: cleanSlotBlog,
      slotDownload: cleanSlotDownload,
    });

    if (result.success) {
      // Perbarui state lokal dengan data yang sudah bersih
      setPublisherId(cleanPublisherId);
      setMessage({ type: 'success', text: 'AdSense Configuration Synced Successfully' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Master Kill-Switch Module */}
        <div className={`border rounded-3xl p-6 md:p-8 flex items-center justify-between transition-colors duration-300 ${isAdsActive ? 'bg-brand-onyx border-brand-accent/20' : 'bg-red-950/20 border-red-500/20'}`}>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
              {isAdsActive ? <Power className="text-brand-accent" size={24} /> : <PowerOff className="text-red-500" size={24} />}
              Master Kill-Switch
            </h3>
            <p className="text-sm text-gray-400">
              {isAdsActive ? "Ads are currently LIVE across the ecosystem." : "Ads are DISABLED. Script injection is halted."}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setIsAdsActive(!isAdsActive)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark ${isAdsActive ? 'bg-brand-accent' : 'bg-gray-600'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 ${isAdsActive ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Identity Module */}
        <div className={`bg-brand-onyx border border-white/5 rounded-3xl p-6 md:p-10 transition-opacity duration-300 ${!isAdsActive && 'opacity-50 pointer-events-none'}`}>
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

        {/* Slot Module */}
        <div className={`bg-brand-onyx border border-white/5 rounded-3xl p-6 md:p-10 transition-opacity duration-300 ${!isAdsActive && 'opacity-50 pointer-events-none'}`}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent text-sm">02</span>
            Slot Configurations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-accent uppercase tracking-widest ml-1 flex items-center gap-2">
                High-RPM Slot (Download Area)
              </label>
              <input
                type="text"
                value={slotDownload}
                onChange={(e) => setSlotDownload(e.target.value)}
                placeholder="Ex: 4444444444"
                className="w-full bg-brand-dark border border-brand-accent/20 focus:border-brand-accent/70 rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono shadow-[0_0_15px_rgba(200,100,50,0.1)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Home Feed Slot</label>
              <input
                type="text"
                value={slotHome}
                onChange={(e) => setSlotHome(e.target.value)}
                placeholder="Ex: 1111111111"
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Detail Page Slot</label>
              <input
                type="text"
                value={slotDetail}
                onChange={(e) => setSlotDetail(e.target.value)}
                placeholder="Ex: 2222222222"
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Blog Articles Slot</label>
              <input
                type="text"
                value={slotBlog}
                onChange={(e) => setSlotBlog(e.target.value)}
                placeholder="Ex: 3333333333"
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-[#5A7D7C]/10 text-[#5A7D7C] border border-[#5A7D7C]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-bold uppercase tracking-wide">{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-10 py-4 bg-brand-accent text-brand-dark font-black uppercase text-sm rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-brand-accent/20"
        >
          {loading ? "Processing..." : "Deploy Ad Configuration"}
          <Save size={18} />
        </button>
      </form>
    </div>
  );
}
