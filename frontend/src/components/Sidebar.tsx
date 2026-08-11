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
        /* Surface step + a rule — at these luminances the step alone is invisible.
           The offsets read off --nav-height rather than restating 64px as 4rem. */
        <div className="sticky top-[var(--nav-height)] flex min-h-[calc(100vh-var(--nav-height))] w-64 flex-col border-r border-line bg-surface">
            <div className="flex flex-1 flex-col overflow-y-auto py-6">
                <nav aria-label="Dashboard sections" className="flex-1 space-y-2 px-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={clsx("side-link", isActive && "side-link--active")}
                            >
                                {/* Azure is spent on the active item's left border —
                                    the icons stay neutral, since a tinted glyph with
                                    no state behind it is decoration. */}
                                <item.icon
                                    className={clsx(
                                        "h-4 w-4 shrink-0",
                                        isActive ? "text-ink" : "text-dim"
                                    )}
                                    strokeWidth={1.5}
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
