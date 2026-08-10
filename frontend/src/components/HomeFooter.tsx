"use client";

import Image from "next/image";
import Link from "next/link";

type LenisInstance = {
    scrollTo: (
        target: Element | string | number,
        options?: { offset?: number; duration?: number }
    ) => void;
};

/* Hover only where hovering is real; every hover changes 2 properties
   (colour + text-decoration-line). */
const linkClass =
    "text-body-sm text-canvas-ink/70 no-underline transition-colors " +
    "[@media(hover:hover)_and_(pointer:fine)]:hover:text-canvas-ink " +
    "[@media(hover:hover)_and_(pointer:fine)]:hover:underline " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-ink";

const pageLinks = [
    { href: "#how-it-works", label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
];

export default function HomeFooter() {
    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const lenis = (window as Window & { lenis?: LenisInstance }).lenis;
            if (lenis) {
                lenis.scrollTo(element, { offset: -80, duration: 1.5 });
            } else {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <footer className="bg-canvas text-canvas-ink border-t border-canvas-ink/15">
            <div className="container-content section--tight">
                <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
                    {/* 1 — wordmark */}
                    <div className="col-span-2 flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <Image
                                src="/logo.png"
                                alt=""
                                aria-hidden
                                width={40}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                            <span className="display text-h3 text-canvas-ink">
                                JobsGPT
                            </span>
                        </div>
                        <p className="text-body-sm text-canvas-ink/70 max-w-[42ch]">
                            JobsGPT watches the boards, scores every opening against your
                            resume, and drafts the outreach.
                        </p>
                    </div>

                    {/* 2 — in-page anchors */}
                    <nav aria-label="Page sections">
                        <h2 className="eyebrow text-canvas-ink mb-6">On this page</h2>
                        <ul className="space-y-4">
                            {pageLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleSmoothScroll(e, link.href)}
                                        className={linkClass}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* 3 — account */}
                    <nav aria-label="Account">
                        <h2 className="eyebrow text-canvas-ink mb-6">Account</h2>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/auth/register" className={linkClass}>
                                    Start free
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className={linkClass}>
                                    Sign in
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* 4 — contact */}
                    <div>
                        <h2 className="eyebrow text-canvas-ink mb-6">Contact</h2>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="mailto:support@jobsgpt.com"
                                    className={linkClass}
                                >
                                    support@jobsgpt.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* bottom rule */}
                <div className="mt-10 flex flex-col gap-6 border-t border-canvas-ink/15 pt-10 md:flex-row md:items-center md:justify-between">
                    <p className="text-body-sm text-canvas-ink/70">
                        © {new Date().getFullYear()} JobsGPT. All rights reserved.
                    </p>
                    <nav aria-label="Legal">
                        <ul className="flex items-center gap-6">
                            <li>
                                <Link href="/privacy" className={linkClass}>
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className={linkClass}>
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <p className="postscript text-canvas-ink/60 mt-10">
                    BUILT BY PEOPLE WHO HATED APPLYING TO JOBS
                </p>
            </div>
        </footer>
    );
}
