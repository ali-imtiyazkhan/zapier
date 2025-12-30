import axios from "axios";
import { useRouter } from "next/navigation";
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
};

export default function ZapNode({
  type,
  step,
  text,
  buttonLabel,
  selectedItem,
  onSelect,
}: Props) {
  const isTrigger = type === "trigger";


  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleButton = async () => {
    setOpen(true);

    if (loaded) return;

    setLoading(true);
    try {
      const url =
        type === "trigger"
          ? "http://localhost:3000/api/v1/trigger/available"
          : "http://localhost:3000/api/v1/action/available";

      const response = await axios.get(url, { withCredentials: true });

      setItems(
        type === "trigger"
          ? response.data.availableTriggers
          : response.data.availableActions
      );

      setLoaded(true);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NODE */}
      {!selectedItem ? (
        <div className="w-full bg-white border-2 border-dashed border-zinc-300 rounded-xl p-4 flex flex-col gap-3">
          <span
            className={`w-fit text-xs font-semibold px-2 py-1 rounded-md
              ${isTrigger
                ? "bg-blue-100 text-blue-600"
                : "bg-zinc-100 text-zinc-700"
              }`}
          >
            {isTrigger ? "Trigger" : "Action"}
          </span>

          <div className="text-sm text-zinc-700">
            <strong>{step}.</strong> {text}
          </div>

          <button
            onClick={handleButton}
            className="mt-2 w-fit text-sm px-3 py-1.5 rounded-md
                       border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          >
            + {buttonLabel}
          </button>
        </div>
      ) : (
        <div className="w-full bg-white border border-zinc-300 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-200 flex items-center justify-center">
            {selectedItem.image ? (
              <img
                src={selectedItem.image}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xs text-black">N/A</span>
            )}
          </div>

          <div className="flex-1">
            <p className="text-xs text-black">
              {isTrigger ? "Trigger" : "Action"}
            </p>
            <p className="text-sm font-medium text-black">
              {selectedItem.name}
            </p>
          </div>

          <button
            onClick={handleButton}
            className="text-xs px-2 py-1 rounded-md border border-zinc-300 text-zinc-600"
          >
            Change
          </button>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-105 rounded-xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold text-sm text-black">
                Select a {isTrigger ? "Trigger" : "Action"}
              </h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="max-h-87.5 overflow-y-auto p-2">
              {loading && <p className="text-center py-6">Loading...</p>}

              {!loading &&
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(type, item);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-zinc-200 rounded-md overflow-hidden text-black">
                      {item.image && (
                        <img
                          src={item.image}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">{item.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
