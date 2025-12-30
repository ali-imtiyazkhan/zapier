type Props = {
    onUndo: () => void;
    canUndo: boolean;
};

export default function ZapHeader({ onUndo, canUndo }: Props) {
    return (
        <header className="h-14 bg-[#2f2a26] text-white flex items-center justify-between px-4">
            <div className="font-bold text-sm">Zaps</div>

            <div className="flex items-center gap-2 text-sm">
                <span>Untitled Zap</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-600 text-xs">
                    Draft
                </span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`text-sm ${canUndo
                            ? "text-zinc-300 hover:text-white"
                            : "text-zinc-500 cursor-not-allowed"
                        }`}
                >
                    Undo
                </button>

                <button className="text-sm text-zinc-300 hover:text-white">
                    Test run
                </button>

                <button className="bg-orange-500 px-3 py-1.5 rounded-md text-sm">
                    Publish
                </button>
            </div>
        </header>
    );
}
