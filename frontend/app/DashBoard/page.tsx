"use client";

import Sidebar from "../../component/Sidebar";
import Topbar from "../../component/Topbar";
import ZapsPage from "../../component/ZapPage";

export default function DashboardPage() {
    return (
        <div className="flex h-screen bg-[#fffdf8] text-black">

            <Sidebar />

            <div className="flex flex-col flex-1">
                <Topbar />
                <ZapsPage />
            </div>
        </div>
    );
}
