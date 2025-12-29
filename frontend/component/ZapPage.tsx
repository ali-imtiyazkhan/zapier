import Image from "next/image";

const ZapsPage = () => {
    return (
        <main className="flex-1 p-8 overflow-y-auto">


            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Zaps</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                    + Create
                </button>
            </div>

            <div className="flex gap-4 mb-10">
                <input
                    type="text"
                    placeholder="Search by name or webhook"
                    className="w-96 border px-4 py-2 rounded-lg"
                />
                <select className="border px-4 py-2 rounded-lg">
                    <option>All Zaps</option>
                </select>
                <button className="border px-4 py-2 rounded-lg">Filters</button>
            </div>

            <div className="bg-white rounded-xl shadow p-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-2"> Zaps</h2>
                    <p className="text-gray-600 max-w-md">
                        Start an automation by connecting two apps, a trigger and an action.
                        Zapier integrates instantly with over 7,000 apps.
                    </p>

                    <button className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg">
                        + Create Zap
                    </button>
                </div>

                <div className="w-200 h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">

                    <Image src="/zapierDemp.png" alt="zapier demo" width={320} height={200} />

                </div>
            </div>

        </main>
    );
};

export default ZapsPage;
