type Props = {
  last?: boolean;
  onAdd: () => void;
};

export default function Connector({ last, onAdd }: Props) {
  return (
    <div className="flex flex-col items-center my-2">
      {!last && <div className="w-px h-8 bg-zinc-400" />}

      <button
        onClick={onAdd}
        className="w-8 h-8 rounded-full border-2 border-zinc-400 bg-white
                   flex items-center justify-center text-lg
                   hover:bg-zinc-100 transition"
      >
        +
      </button>
    </div>
  );
}
