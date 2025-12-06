"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Settings } from "lucide-react";
import clsx from "clsx";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 bg-white/80 backdrop-blur-sm border-r border-[#b8c5d6]/30 min-h-[calc(100vh-4rem)] sticky top-16">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                <nav className="flex-1 px-3 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    isActive
                                        ? "bg-gradient-to-r from-[#e8eef5] to-[#b8c5d6]/50 text-[#22223b] border-l-4 border-[#5b6fa3] shadow-md"
                                        : "text-[#4a4e69] hover:bg-[#e8eef5] hover:text-[#22223b]",
                                    "group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:translate-x-1"
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        isActive ? "text-[#5b6fa3]" : "text-[#5b6fa3]/60 group-hover:text-[#5b6fa3]",
                                        "mr-3 flex-shrink-0 h-5 w-5 transition-colors"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
