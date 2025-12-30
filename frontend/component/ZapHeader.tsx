import { useState } from "react";

type Props = {
  onUndo: () => void;
  canUndo: boolean;
  onPublish: () => Promise<void>;
};

export default function ZapHeader({ onUndo, canUndo, onPublish }: Props) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
      alert("Zap published successfully ");
    } catch {
      alert("Failed to publish zap");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="h-14 bg-[#2f2a26] text-white flex items-center justify-between px-4">
      <div className="font-bold text-sm">Zaps</div>

      <div className="flex items-center gap-2 text-sm">
        <span>Untitled Zap</span>
        <span className="px-2 py-0.5 rounded-full bg-zinc-600 text-xs">Draft</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={canUndo ? "text-zinc-300" : "text-zinc-500"}
        >
          Undo
        </button>

        <button className="text-zinc-300">Test run</button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="bg-orange-500 px-3 py-1.5 rounded-md"
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </header>
  );
}
