"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-[#c9ada7]/30 sticky top-0 z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex-shrink-0 group">
                            <img 
                                src="/logo.png" 
                                alt="JobsGPT" 
                                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#f2e9e4] rounded-lg">
                            <span className="text-sm text-[#4a4e69] font-medium truncate max-w-xs">{session?.user?.email}</span>
                        </div>
                        <button
                            onClick={() => {
                                setLoading(true);
                                signOut({ callbackUrl: "/auth/login" });
                            }}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#4a4e69] bg-white border-2 border-[#c9ada7] rounded-xl hover:bg-[#f2e9e4] hover:border-[#9a8c98] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a4e69] transition-all duration-200 disabled:opacity-50"
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
