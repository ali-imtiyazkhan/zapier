"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Zap = {
  id: string;
  trigger?: {
    availableTrigger?: {
      name: string;
      image?: string | null;
    };
  } | null;
  actions: {
    id: string;
    order: number;
    availableAction?: {
      name: string;
      image?: string | null;
    };
  }[];
};

const ZapPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [zap, setZap] = useState<Zap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZap = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:3000/api/v1/zap/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setZap(res.data.zap);
      } catch (err) {
        console.error("Failed to fetch zap", err);
      } finally {
        setLoading(false);
      }
    };

    fetchZap();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  if (!zap) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Zap not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <h1 className="text-2xl font-semibold mb-8 text-black">
        Zap Builder
      </h1>

      <div className="bg-white border rounded-xl p-5 mb-6">
        <p className="text-xs text-zinc-500 mb-2">Trigger</p>

        {zap.trigger?.availableTrigger ? (
          <div className="flex items-center gap-3">
            {zap.trigger.availableTrigger.image ? (
              <img
                src={zap.trigger.availableTrigger.image}
                alt="trigger"
                className="h-8 w-8"
              />
            ) : (
              <span className="text-xs text-zinc-400">N/A</span>
            )}

            <span className="font-medium text-black">
              {zap.trigger.availableTrigger.name}
            </span>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">
            No trigger configured
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white border rounded-xl p-5">
        <p className="text-xs text-zinc-500 mb-4">Actions</p>

        <div className="space-y-3">
          {zap.actions.length === 0 && (
            <p className="text-sm text-zinc-400">
              No actions added yet
            </p>
          )}

          {zap.actions
            .sort((a, b) => a.order - b.order)
            .map((action) => (
              <div
                key={action.id}
                className="flex items-center gap-3 border rounded-lg p-3"
              >
                {action.availableAction?.image ? (
                  <img
                    src={action.availableAction.image}
                    alt="action"
                    className="h-6 w-6"
                  />
                ) : (
                  <span className="text-xs text-zinc-400">N/A</span>
                )}

                <span className="text-black text-sm">
                  {action.availableAction?.name ?? "Unknown action"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ZapPage;
