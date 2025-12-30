"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Zap = {
    id: string;
    trigger: {
        availableTrigger: {
            name: string;
        };
    };
    actions: {
        id: string;
        availableAction: {
            name: string;
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
            } catch (error) {
                console.error("Failed to fetch zaps", error);
            } finally {
                setLoading(false);
            }
        };

        fetchZaps();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-zinc-600">
                Loading zaps...
            </div>
        );
    }

    if (zaps.length === 0) {
        return (
            <div className="p-6 text-zinc-600">
                No zaps found. Create your first zap 🚀
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-6">Your Zaps</h1>

            <div className="space-y-4">
                {zaps.map((zap) => (
                    <div
                        key={zap.id}
                        onClick={() => router.push(`/zap/${zap.id}`)}
                        className="bg-white border border-zinc-200 rounded-lg p-4
                       hover:bg-zinc-50 cursor-pointer transition"
                    >
                        <div className="mb-2">
                            <span className="text-xs text-zinc-500">Trigger</span>
                            <p className="font-medium">
                                {zap.trigger.availableTrigger.name}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">Actions</span>
                            <ul className="list-disc ml-5 text-sm">
                                {zap.actions.map((action) => (
                                    <li key={action.id}>
                                        {action.availableAction.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
