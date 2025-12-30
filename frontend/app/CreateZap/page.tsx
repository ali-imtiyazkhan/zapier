"use client";

import { useState } from "react";
import axios from "axios";

import ZapNode, { Item } from "@/component/ZapNode";
import Connector from "@/component/Connector";
import ZapHeader from "@/component/ZapHeader";


type Step = {
  id: number;
  type: "trigger" | "action";
  text: string;
};

export default function ZapPage() {

  const [steps, setSteps] = useState<Step[]>([
    { id: 1, type: "trigger", text: "Select the event that starts your Zap" },
  ]);

  const [history, setHistory] = useState<Step[][]>([]);

  const [selectedTrigger, setSelectedTrigger] = useState<Item | null>(null);
  const [selectedActions, setSelectedActions] = useState<Item[]>([]);

  const addAction = () => {
    setHistory((h) => [...h, steps]);
    setSteps((s) => [
      ...s,
      {
        id: s.length + 1,
        type: "action",
        text: "Select the event for your Zap to run",
      },
    ]);
  };

  const handleUndo = () => {
    if (!history.length) return;
    setSteps(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const handleSelect = (type: "trigger" | "action", item: Item) => {
    if (type === "trigger") {
      setSelectedTrigger(item);
    } else {
      setSelectedActions((prev) => [...prev, item]);
    }
  };

  const handlePublish = async () => {
    if (!selectedTrigger) {
      alert("Please select a trigger");
      return;
    }

    if (selectedActions.length === 0) {
      alert("Please select at least one action");
      return;
    }

    const payload = {
      availableTriggerId: selectedTrigger.id,
      action: selectedActions.map((action) => ({
        availableActionId: action.id,
      })),
    };

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:3000/api/v1/zap/zapCreate",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


  };

  return (
    <div className="h-screen flex flex-col bg-[#f8f7f4]">
      <ZapHeader
        onUndo={handleUndo}
        canUndo={history.length > 0}
        onPublish={handlePublish}
      />

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
                selectedItem={
                  step.type === "trigger"
                    ? selectedTrigger
                    : selectedActions[index - 1] ?? null
                }
                onSelect={handleSelect}
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
