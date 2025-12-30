import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter()
    return (
        <aside className="w-64 border-r bg-[#fffdf8] p-4 flex flex-col justify-between">

            <div>
                <button onClick={() => {
                    router.push("/CreateZap")
                }} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mb-6 cursor-pointer">
                    + Create
                </button>

                <nav className="space-y-3 text-sm">

                    <button className="text-gray-700 hover:text-black cursor-pointer">Home</button>
                    <br />
                    <button onClick={() => {
                        router.push("/currentZap")
                    }} className="font-medium cursor-pointer"> Zaps</button>
                    <div className="text-gray-700 hover:text-black cursor-pointer">Discover</div>
                    <div className="text-gray-700 hover:text-black cursor-pointer">Tables</div>
                    <div className="text-gray-700 hover:text-black cursor-pointer">Interfaces</div>
                    <div className="text-gray-700 hover:text-black cursor-pointer">Chatbots</div>
                    <div className="text-gray-700 hover:text-black cursor-pointer">Agents</div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
