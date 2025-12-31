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
      const url =
        type === "trigger"
          ? "http://localhost:3000/api/v1/trigger/available"
          : "http://localhost:3000/api/v1/action/available";

      const res = await axios.get(url);
      setItems(
        type === "trigger"
          ? res.data.availableTriggers
          : res.data.availableActions
      );
      setLoaded(true);
    } catch (err) {
      console.error(err);
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

  return (
    <>
      {!selectedItem ? (
        <div className="w-full bg-white border-2 border-dashed rounded-xl p-4">
          <div className="text-sm text-black">
            <strong>{step}.</strong> {text}
          </div>
          <button
            onClick={handleButton}
            className="mt-3 text-sm border px-3 py-1.5 rounded-md text-black"
          >
            + {buttonLabel}
          </button>
        </div>
      ) : (
        <div className="w-full bg-white border rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={selectedItem.image}
              className="h-8 w-8"
              alt=""
            />
            <span className="text-black">{selectedItem.name}</span>
          </div>

          {!isTrigger && (
            <button
              onClick={() => setConfigOpen(true)}
              className="text-xs border px-2 py-1 rounded"
            >
              Configure
            </button>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-xl">
            <div className="p-3 border-b flex justify-between text-black">
              <span>Select {type}</span>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="p-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(type, item);
                    setOpen(false);

                    if (!isTrigger) {
                      setConfig({});
                      setConfigOpen(true);
                    }
                  }}
                  className="flex items-center gap-3 p-2 text-black hover:bg-zinc-100 cursor-pointer"
                >
                  <img src={item.image} className="h-6 w-6" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {configOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-105 rounded-xl p-4">
            <h2 className="font-semibold mb-3 text-black">
              Configure {selectedItem.name}
            </h2>

            {selectedItem.name === "Send Email" && (
              <div className="space-y-2 text-black">
                <input
                  placeholder="To"
                  className="w-full border px-2 py-1 text-black placeholder:text-zinc-500"
                  onChange={(e) =>
                    setConfig({ ...config, to: e.target.value })
                  }
                />
                <input
                  placeholder="Subject"
                  className="w-full border px-2 py-1 text-black placeholder:text-zinc-500"
                  onChange={(e) =>
                    setConfig({ ...config, subject: e.target.value })
                  }
                />
                <textarea
                  placeholder="Body"
                  className="w-full border px-2 py-1 text-black placeholder:text-zinc-500"
                  onChange={(e) =>
                    setConfig({ ...config, body: e.target.value })
                  }
                />
              </div>
            )}

            {selectedItem.name === "sms-send" && (
              <div className="space-y-2 text-black">
                <input
                  placeholder="To"
                  className="w-full border px-2 py-1 text-black placeholder:text-zinc-500"
                  onChange={(e) =>
                    setConfig({ ...config, to: e.target.value })
                  }
                />
                <textarea
                  placeholder="Message"
                  className="w-full border px-2 py-1 text-black placeholder:text-zinc-500"
                  onChange={(e) =>
                    setConfig({ ...config, message: e.target.value })
                  }
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfigOpen(false)}
                className="text-sm px-3 py-1 border rounded text-black"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="text-sm px-3 py-1 bg-orange-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
