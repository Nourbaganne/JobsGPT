"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        router.push("/auth/login");
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-[#b8c5d6]/30 sticky top-0 z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="shrink-0 group">
                            <Image
                                width={75}
                                height={16}
                                src="/logo.png" 
                                alt="JobsGPT" 
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#e8eef5] rounded-lg">
                            <span className="text-sm text-[#4a4e69] font-medium truncate max-w-xs">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#4a4e69] bg-white border-2 border-[#b8c5d6] rounded-xl hover:bg-[#e8eef5] hover:border-[#5b6fa3] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b6fa3] transition-all duration-200 disabled:opacity-50"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">{loading ? "Signing out..." : "Logout"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
