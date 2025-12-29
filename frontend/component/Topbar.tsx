const Topbar = () => {
  return (
    <header className="h-14 border-b bg-[#fffdf8] flex items-center justify-between px-6">
      
      <div className="font-bold text-lg">Zapier</div>

      <div className="flex items-center gap-4 text-sm">
        <button className="text-gray-700 hover:text-black">Help</button>
        <button className="text-gray-700 hover:text-black">Explore apps</button>
        <button className="border px-3 py-1 rounded-md">Contact Sales</button>
        <button className="bg-indigo-600 text-white px-3 py-1 rounded-md">
          Upgrade
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          ik
        </div>
      </div>

    </header>
  );
};

export default Topbar;
