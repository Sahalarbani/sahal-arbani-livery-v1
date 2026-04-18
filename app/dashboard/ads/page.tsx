import React from 'react';
import { getAdSettings } from "@/lib/actions/ads";
import { AdSettingsForm } from "@/components/dashboard/AdSettingsForm";
import { Megaphone, ShieldCheck } from "lucide-react";

export default async function AdsDashboardPage() {
  const settings = await getAdSettings();

  return (
    <div className="relative z-10 animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
            <Megaphone className="text-brand-accent animate-pulse" size={20} />
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em]">Monetization Module</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
          ADSENSE <span className="text-brand-accent">MANAGER</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-xl text-sm leading-relaxed">
          Centralized terminal for managing advertisement assets. Deploy your Google AdSense Publisher and Slot IDs without re-touching the source code.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-10 px-4 py-2 bg-brand-sage/10 rounded-full border border-brand-sage/20 w-fit">
        <ShieldCheck size={14} className="text-brand-sage" />
        <span className="text-[9px] font-bold text-brand-sage uppercase tracking-widest">Operator: Master Admin</span>
      </div>

      <AdSettingsForm initialSettings={settings} />
    </div>
  );
}
