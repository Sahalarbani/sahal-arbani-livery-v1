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
        <div className={`flex items-center justify-between rounded-3xl border p-6 transition-colors duration-300 md:p-8 ${isAdsActive ? 'border-white/10 bg-brand-onyx' : 'border-red-500/20 bg-red-50'}`}>
          <div>
            <h3 className="mb-1 flex items-center gap-3 text-xl font-bold text-zinc-50">
              {isAdsActive ? <Power className="text-brand-accent" size={24} /> : <PowerOff className="text-red-500" size={24} />}
              Master Kill-Switch
            </h3>
            <p className="text-sm text-zinc-400">
              {isAdsActive ? "Ads are currently LIVE across the ecosystem." : "Ads are DISABLED. Script injection is halted."}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setIsAdsActive(!isAdsActive)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark ${isAdsActive ? 'bg-brand-accent' : 'bg-gray-600'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-brand-onyx transition duration-300 ${isAdsActive ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Identity Module */}
        <div className={`rounded-3xl border border-white/10 bg-brand-onyx p-6 transition-opacity duration-300 md:p-10 ${!isAdsActive && 'opacity-50 pointer-events-none'}`}>
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-zinc-50">
            <span className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent text-sm">01</span>
            Publisher Identity
          </h3>
          
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Google Publisher ID (ca-pub-xxx)</label>
            <input
              type="text"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="field-control font-mono"
            />
          </div>
        </div>

        {/* Slot Module */}
        <div className={`rounded-3xl border border-white/10 bg-brand-onyx p-6 transition-opacity duration-300 md:p-10 ${!isAdsActive && 'opacity-50 pointer-events-none'}`}>
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-zinc-50">
            <span className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent text-sm">02</span>
            Slot Configurations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="ml-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent">
                High-RPM Slot (Download Area)
              </label>
              <input
                type="text"
                value={slotDownload}
                onChange={(e) => setSlotDownload(e.target.value)}
                placeholder="Ex: 4444444444"
                className="field-control border-brand-accent/30 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Home Feed Slot</label>
              <input
                type="text"
                value={slotHome}
                onChange={(e) => setSlotHome(e.target.value)}
                placeholder="Ex: 1111111111"
                className="field-control font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Detail Page Slot</label>
              <input
                type="text"
                value={slotDetail}
                onChange={(e) => setSlotDetail(e.target.value)}
                placeholder="Ex: 2222222222"
                className="field-control font-mono"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Blog Articles Slot</label>
              <input
                type="text"
                value={slotBlog}
                onChange={(e) => setSlotBlog(e.target.value)}
                placeholder="Ex: 3333333333"
                className="field-control font-mono"
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
          className="flex w-full items-center justify-center gap-3 rounded-full bg-brand-cyan px-10 py-4 text-sm font-black uppercase text-black shadow-lg transition-all hover:scale-[1.02] hover:bg-brand-cyan active:scale-95 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Deploy Ad Configuration"}
          <Save size={18} />
        </button>
      </form>
    </div>
  );
}
