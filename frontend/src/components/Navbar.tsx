"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";

/* Same ring the landing nav uses on its anchors. `.btn` carries its own
   focus-visible outline, so only the logo link needs this. */
const FOCUS_RING =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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
        /* Veil + blur, no shadow: the bar is separated from what scrolls under it
           by the hairline alone, exactly as on the landing page. */
        <nav
            aria-label="Dashboard"
            className="sticky top-0 z-50 border-b border-line bg-canvas/80"
            style={{
                backdropFilter: "blur(var(--nav-blur))",
                WebkitBackdropFilter: "blur(var(--nav-blur))",
            }}
        >
            <div className="px-6">
                <div className="flex h-[var(--nav-height)] items-center justify-between gap-6">
                    <Link
                        href="/dashboard"
                        aria-label="Lynceus — dashboard"
                        className={`flex shrink-0 items-center ${FOCUS_RING}`}
                    >
                        <Wordmark className="text-[20px] text-ink" />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* The address is data, not a label, so the chip's uppercase
                            and tracking are dropped and it reads verbatim. Neutral:
                            an account identifier is not one of the four states. */}
                        <span className="chip hidden max-w-[32ch] normal-case tracking-normal sm:inline-flex">
                            <span className="truncate">{user?.email}</span>
                        </span>

                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="btn btn--secondary"
                        >
                            {loading ? (
                                <span className="spinner" aria-hidden="true" />
                            ) : (
                                <LogOut
                                    className="h-4 w-4"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            )}
                            <span className="hidden sm:inline">
                                {loading ? "Signing out..." : "Logout"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
