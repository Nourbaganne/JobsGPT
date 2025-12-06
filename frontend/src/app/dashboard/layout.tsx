"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Authentication is handled by middleware and individual pages
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e8eef5] via-white to-[#b8c5d6]/20">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full">{children}</main>
            </div>
        </div>
    );
}
