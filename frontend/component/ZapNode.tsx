"use client";

import axios from "axios";
import { useState } from "react";

export type Item = {
  id: string;
  name: string;
  image?: string;
};

type Props = {
  type: "trigger" | "action";
  step: string;
  text: string;
  buttonLabel: string;
  selectedItem?: Item | null;
  onSelect: (type: "trigger" | "action", item: Item) => void;
  onConfigChange?: (actionId: string, config: any) => void;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

const CONFIG_FIELDS: Record<string, { label: string; placeholder: string; type: "input" | "textarea" }[]> = {
  "Send Email": [
    { label: "To", placeholder: "recipient@example.com", type: "input" },
    { label: "Subject", placeholder: "Hello!", type: "input" },
    { label: "Body", placeholder: "Email content...", type: "textarea" },
  ],
  "sms-send": [
    { label: "To", placeholder: "+1234567890", type: "input" },
    { label: "Message", placeholder: "Your message...", type: "textarea" },
  ],
};

function ConfigField({ 
  field, 
  value, 
  onChange 
}: { 
  field: any; 
  value: string; 
  onChange: (val: string) => void 
}) {
  const Component = field.type === "textarea" ? "textarea" : "input";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500">{field.label}</label>
      <Component
        placeholder={field.placeholder}
        value={value || ""}
        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-black"
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function ZapNode({
  type,
  step,
  text,
  buttonLabel,
  selectedItem,
  onSelect,
  onConfigChange,
}: Props) {
  const isTrigger = type === "trigger";

  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [config, setConfig] = useState<Record<string, any>>({});

  const handleButton = async () => {
    setOpen(true);

    if (loaded) return;

    setLoading(true);
    try {
      const endpoint = isTrigger ? "trigger/available" : "action/available";
      const res = await axios.get(`${BACKEND_URL}/api/v1/${endpoint}`);
      setItems(isTrigger ? res.data.availableTriggers : res.data.availableActions);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = () => {
    if (selectedItem && onConfigChange) {
      onConfigChange(selectedItem.id, config);
    }
    setConfigOpen(false);
  };

  const fields = selectedItem ? CONFIG_FIELDS[selectedItem.name] : [];

  return (
    <>
      <div className="relative group">
        {!selectedItem ? (
          <div className="w-full bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-6 transition-all hover:border-orange-200 hover:bg-orange-50/10 active:scale-[0.99] cursor-pointer" onClick={handleButton}>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold">
                {step}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-800">{text}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{buttonLabel}</p>
              </div>
              <div className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-orange-500 group-hover:border-orange-200 transition-colors">
                <span className="text-xl">+</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex justify-between items-center group/card">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                <img src={selectedItem.image} className="h-8 w-8 object-contain" alt="" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{type} {step}</span>
                  <div className="h-1 w-1 rounded-full bg-zinc-300" />
                  <span className="text-xs text-zinc-400">Ready</span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">{selectedItem.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
              {!isTrigger && (
                <button
                  onClick={() => setConfigOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Edit Configuration
                </button>
              )}
              <button onClick={handleButton} className="p-2 text-zinc-400 hover:text-zinc-600">
                <span className="text-lg">⚙️</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Item Choice Modal */}
      {open && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-900">Select {type}</h2>
              <button 
                onClick={() => setOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 transition-colors"
              >✕</button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                {loading ? (
                  <div className="p-8 text-center text-zinc-400">Loading options...</div>
                ) : items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(type, item);
                      setOpen(false);
                      if (!isTrigger) {
                        setConfig({});
                        setConfigOpen(true);
                      }
                    }}
                    className="flex items-center gap-4 p-3 rounded-2xl text-left hover:bg-orange-50 transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-zinc-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-orange-100">
                      <img src={item.image} className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-zinc-800">{item.name}</span>
                      <span className="block text-xs text-zinc-500">Click to select</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {configOpen && selectedItem && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100">
              <div className="flex items-center gap-3 mb-1">
                <img src={selectedItem.image} className="h-6 w-6" />
                <h2 className="text-xl font-bold text-zinc-900">Configure {selectedItem.name}</h2>
              </div>
              <p className="text-sm text-zinc-500">Fill in the details for this automation step</p>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {fields && fields.length > 0 ? fields.map((f, i) => (
                <ConfigField 
                  key={i}
                  field={f}
                  value={config[f.label.toLowerCase()]}
                  onChange={(val) => setConfig({ ...config, [f.label.toLowerCase()]: val })}
                />
              )) : (
                <p className="text-center py-4 text-zinc-500">No additional configuration required for this step.</p>
              )}
            </div>

            <div className="p-6 bg-zinc-50 flex justify-end gap-3">
              <button
                onClick={() => setConfigOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
