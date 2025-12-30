"use client";

import { useState } from "react";
import ZapNode from "@/component/ZapNode";
import Connector from "@/component/Connector";
import ZapHeader from "@/component/ZapHeader";

type Step = {
    id: number;
    type: "trigger" | "action";
    text: string;
};

export default function ZapPage() {
    const [steps, setSteps] = useState<Step[]>([
        {
            id: 1,
            type: "trigger",
            text: "Select the event that starts your Zap",
        },
    ]);

    // history stack
    const [history, setHistory] = useState<Step[][]>([]);

    const addAction = () => {
        setHistory((prev) => [...prev, steps]); // save current state

        setSteps((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                type: "action",
                text: "Select the event for your Zap to run",
            },
        ]);
    };

    const handleUndo = () => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];
        setHistory((prev) => prev.slice(0, -1));
        setSteps(lastState);
    };

    return (
        <div className="h-screen flex flex-col bg-[#f8f7f4]">
            <ZapHeader onUndo={handleUndo} canUndo={history.length > 0} />

            <main
                className="flex-1 flex justify-center pt-10
        bg-[radial-gradient(#ddd_1px,transparent_1px)]
        bg-size-[16px_16px]"
            >
                <div className="w-105 flex flex-col items-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="w-full">
                            <ZapNode
                                type={step.type}
                                step={(index + 1).toString()}
                                text={step.text}
                                buttonLabel={`Add ${step.type}`}
                            />

                            <Connector
                                last={index === steps.length - 1}
                                onAdd={addAction}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}