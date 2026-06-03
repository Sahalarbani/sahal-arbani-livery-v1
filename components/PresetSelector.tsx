"use client";

import React, { useState, useEffect } from "react";
import { Save, Trash2, ChevronDown, FileText, X, Check } from "lucide-react";
import { getPresets, savePreset, deletePreset } from "@/app/lib/actions";

interface Preset {
  id: string;
  name: string;
  content: string;
}

interface PresetSelectorProps {
  currentDescription: string;
  onSelect: (content: string) => void;
}

export default function PresetSelector({ currentDescription, onSelect }: PresetSelectorProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    const data = await getPresets();
    setPresets(data);
  };

  const handleSave = async () => {
    if (!newName.trim() || !currentDescription.trim()) return;
    setLoading(true);
    const res = await savePreset(newName, currentDescription);
    if (res.success) {
      setNewName("");
      setIsSaving(false);
      loadPresets();
    }
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this preset permanently?")) return;
    await deletePreset(id);
    loadPresets();
  };

  return (
    <div className="mb-4 relative z-20">
      <div className="flex gap-3">
        {/* DROPDOWN MAIN WRAPPER */}
        <div className="relative flex-grow">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-full border border-zinc-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-accent shadow-sm transition-all duration-300 hover:border-brand-accent/50 hover:bg-zinc-50"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} /> LOAD PRESET ({presets.length})
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full z-50 mt-3 max-h-64 w-full overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              {presets.length === 0 ? (
                <div className="p-4 text-center font-mono text-xs text-zinc-500">NO DATA FOUND</div>
              ) : (
                presets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelect(p.content);
                      setIsOpen(false);
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-zinc-50"
                  >
                    <span className="truncate text-xs font-medium text-zinc-700 group-hover:text-zinc-950">{p.name}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, p.id)}
                      className="rounded-full p-2 text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* SAVE BUTTON AREA */}
        {!isSaving ? (
          <button
            type="button"
            onClick={() => setIsSaving(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-300 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
            title="Save Current as Preset"
          >
            <Save size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-5 fade-in">
            <input
              type="text"
              placeholder="NAME..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-32 rounded-full border border-brand-accent/50 bg-white px-4 py-3 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 md:w-48"
              autoFocus
            />
            <button type="button" onClick={handleSave} disabled={loading} className="text-brand-accent bg-brand-accent/10 hover:bg-brand-accent hover:text-brand-dark w-10 h-10 flex items-center justify-center rounded-full border border-brand-accent/30 transition-all">
                <Check size={16} />
            </button>
            <button type="button" onClick={() => setIsSaving(false)} className="text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white w-10 h-10 flex items-center justify-center rounded-full border border-red-500/30 transition-all">
                <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
