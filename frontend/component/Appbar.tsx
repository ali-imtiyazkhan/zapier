
"use client";

import { useRouter } from "next/navigation";

export default function Appbar() {
  const router = useRouter();

  return (
    <div className="flex justify-center w-full px-4 pt-4">
      <div className="max-w-7xl w-full flex justify-between items-center py-4 px-8 bg-white/80 backdrop-blur-md rounded-2xl border border-zinc-100 shadow-sm transition-all duration-300">
        <div 
          className="text-2xl font-black text-orange-500 cursor-pointer tracking-tighter flex items-center gap-2" 
          onClick={() => router.push("/")}
        >
          <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
          <span className="text-zinc-900">Zapier</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => {}} 
            className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Contact Sales
          </button>
          <button 
            onClick={() => router.push("/login")} 
            className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => router.push("/signup")} 
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}