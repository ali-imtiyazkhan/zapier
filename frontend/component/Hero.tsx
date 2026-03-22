"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {

  const router = useRouter();
  return (
    <section className="relative min-h-screen bg-white flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-200/40 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-zinc-100 rounded-full blur-[100px] -z-10" />

      <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-orange-500" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Zapier Reimagined</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-950 leading-[0.9] tracking-tighter max-w-5xl mx-auto">
          Automate as fast as you can <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">type</span>
        </h1>

        <p className="mt-8 max-w-2xl mx-auto text-xl text-zinc-600 font-medium leading-relaxed">
          AI gives you automation superpowers, and Zapier puts them to work.
          Pairing AI and Zapier helps you turn ideas into workflows and bots
          that work for you.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => { router.push("/signup") }} 
            className="group relative bg-orange-500 text-white font-bold px-10 py-5 rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Get started free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button className="px-10 py-5 text-zinc-950 font-bold border-2 border-zinc-200 rounded-full hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all duration-300">
            Contact Sales
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-12 text-zinc-500 text-sm font-bold uppercase tracking-widest">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl mb-1">✨</span>
            <span>Free forever</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl mb-1">🔗</span>
            <span>More apps</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl mb-1">🤖</span>
            <span>AI powered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
