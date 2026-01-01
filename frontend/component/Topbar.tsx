import { useRouter } from "next/navigation";


const Topbar = () => {

  const router = useRouter()
  return (

    <header className="h-14 border-b bg-[#fffdf8] flex items-center justify-between px-6">

      <div className="font-bold text-lg">Zapier</div>

      <div className="flex items-center gap-4 text-sm">
        <button className="text-gray-700 hover:text-black">Help</button>
        <button className="border px-3 py-1 rounded-md">Contact Sales</button>
        <button onClick={() => {
          localStorage.clear();
          router.push("/login")

        }} className="bg-indigo-600 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-500 transform duration-300 ease-in-out">
          LogOut
        </button>
      </div>

    </header>
  );
};

export default Topbar;
