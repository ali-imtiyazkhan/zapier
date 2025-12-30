type Props = {
  type: "trigger" | "action";
  step: string;
  text: string;
  buttonLabel: string;
};

export default function ZapNode({ type, step, text, buttonLabel }: Props) {
  const isTrigger = type === "trigger";

  return (
    <div className="w-full bg-white border-2 border-dashed border-zinc-300 rounded-xl p-4 flex flex-col gap-3">
      
      {/* Badge */}
      <span
        className={`w-fit text-xs font-semibold px-2 py-1 rounded-md
          ${isTrigger
            ? "bg-blue-100 text-blue-600"
            : "bg-zinc-100 text-zinc-700"}`}
      >
        {isTrigger ? "Trigger" : "Action"}
      </span>

      {/* Text */}
      <div className="text-sm text-zinc-700">
        <strong>{step}.</strong> {text}
      </div>

      {/* Button */}
      <button
        className="mt-2 w-fit text-sm px-3 py-1.5 rounded-md
                   border border-zinc-300 text-zinc-700
                   hover:bg-zinc-100 transition"
        onClick={() => alert(`Add ${type}`)}
      >
        + {buttonLabel}
      </button>
    </div>
  );
}
