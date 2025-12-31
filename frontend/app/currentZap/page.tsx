"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Zap = {
    id: string;
    trigger?: {
        availableTrigger?: {
            name: string;
            image?: string | null;
        };
    };
    actions: {
        id: string;
        availableAction?: {
            name: string;
            image?: string | null;
        };
    }[];
};

const Page = () => {
    const [zaps, setZaps] = useState<Zap[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchZaps = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:3000/api/v1/zap/zap",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setZaps(res.data.zaps);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchZaps();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-zinc-500 gap-4">
                <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-orange-500 animate-spin" />
                <span className="text-sm">Loading your zaps…</span>
            </div>
        );
    }

    if (zaps.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                No zaps yet. Create your first one
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#fafafa] min-h-screen">
            <h1 className="text-2xl font-semibold mb-8 text-black">
                Your Zaps
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zaps.map((zap) => (
                    <div
                        key={zap.id}
                        onClick={() => router.push(`/zap/${zap.id}`)}
                        className="bg-white border border-zinc-200 rounded-xl p-5
                       hover:shadow-lg hover:border-zinc-300
                       transition cursor-pointer"
                    >
                        {/* Trigger */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-zinc-100">
                                {zap.trigger?.availableTrigger?.image ? (
                                    <img
                                        src={zap.trigger.availableTrigger.image}
                                        alt="trigger"
                                        className="h-6 w-6"
                                    />
                                ) : (
                                    <span className="text-xs text-zinc-400">N/A</span>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-zinc-500">Trigger</p>
                                <p className="font-medium text-black">
                                    {zap.trigger?.availableTrigger?.name ?? "Not set"}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-dashed my-4" />

                        {/* Actions */}
                        <div>
                            <p className="text-xs text-zinc-500 mb-2">Actions</p>

                            <div className="space-y-2">
                                {zap.actions.map((action) => (
                                    <div
                                        key={action.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="h-8 w-8 flex items-center justify-center rounded-md bg-zinc-100">
                                            {action.availableAction?.image ? (
                                                <img
                                                    src={action.availableAction.image}
                                                    alt="action"
                                                    className="h-5 w-5"
                                                />
                                            ) : (
                                                <span className="text-xs text-zinc-400">N/A</span>
                                            )}
                                        </div>

                                        <span className="text-sm text-black">
                                            {action.availableAction?.name ?? "Unknown action"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
