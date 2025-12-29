export default function HeroSection() {
  return (
    <section className="min-h-screen bg-[#fffdf8] flex flex-col items-center justify-center text-center px-4 pt-10">
      
      <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
        Automate as fast as you can <br /> type
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-700">
        AI gives you automation superpowers, and Zapier puts them to work.
        Pairing AI and Zapier helps you turn ideas into workflows and bots
        that work for you.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition">
          Get started free
        </button>

        <button className="border border-black text-black font-semibold px-8 py-4 rounded-full hover:bg-black hover:text-white transition">
          Contact Sales
        </button>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-6 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <span><b>Free forever</b> for core features</span>
        </div>
        <div className="flex items-center gap-2">
           <span><b>More apps</b> than any other platform</span>
        </div>
        <div className="flex items-center gap-2">
           <span>Cutting-edge <b>AI features</b></span>
        </div>
      </div>

    </section>
  );
}
