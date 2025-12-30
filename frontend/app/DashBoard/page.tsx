"use client";

import { useEffect } from "react";
import Sidebar from "../../component/Sidebar";
import Topbar from "../../component/Topbar";
import ZapsPage from "../../component/ZapPage";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/signup");
        }
    }, [router])

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
