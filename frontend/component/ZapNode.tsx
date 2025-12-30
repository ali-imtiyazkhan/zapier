import axios from "axios";
import { useState } from "react";

type Item = {
  id: number;
  name: string;
  image?: string;
};

type Props = {
  type: "trigger" | "action";
  step: string;
  text: string;
  buttonLabel: string;
};

export default function ZapNode({ type, step, text, buttonLabel }: Props) {
  const isTrigger = type === "trigger";

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const handleButton = async () => {
    setOpen(true);
    setLoading(true);

    try {
      const url =
        type === "trigger"
          ? "http://localhost:3000/api/v1/trigger/available"
          : "http://localhost:3000/api/v1/action/available";

      const response = await axios.get(url);

      setItems(
        type === "trigger"
          ? response.data.availableTriggers
          : response.data.availableActions
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN NODE */}
      <div className="w-full bg-white border-2 border-dashed border-zinc-300 rounded-xl p-4 flex flex-col gap-3">
        <span
          className={`w-fit text-xs font-semibold px-2 py-1 rounded-md
            ${isTrigger
              ? "bg-blue-100 text-blue-600"
              : "bg-zinc-100 text-zinc-700"}`}
        >
          {isTrigger ? "Trigger" : "Action"}
        </span>

        <div className="text-sm text-zinc-700">
          <strong>{step}.</strong> {text}
        </div>

        <button
          onClick={handleButton}
          className="mt-2 w-fit text-sm px-3 py-1.5 rounded-md
                     border border-zinc-300 text-zinc-700
                     hover:bg-zinc-100 transition"
        >
          + {buttonLabel}
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-105 rounded-xl shadow-lg">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold text-sm text-black">
                Select a {isTrigger ? "Trigger" : "Action"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-700 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="max-h-87.5 overflow-y-auto p-2">
              {loading && (
                <p className="text-center text-sm text-zinc-500 py-6">
                  Loading...
                </p>
              )}

              {!loading &&
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-md
             hover:bg-zinc-100 cursor-pointer"
                    onClick={() => {
                      console.log("Selected:", item);
                      setOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-md overflow-hidden text-black bg-zinc-200 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-zinc-500">N/A</span>
                      )}
                    </div>

                    {/* NAME */}
                    <span className="text-sm text-black font-medium">{item.name}</span>
                  </div>

                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
