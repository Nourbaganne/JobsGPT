"use client";

import Link from "next/link";
import Wordmark from "@/components/Wordmark";

type LenisInstance = {
    scrollTo: (
        target: Element | string | number,
        options?: { offset?: number; duration?: number }
    ) => void;
};

/* Hover only where hovering is real; every hover changes 2 properties
   (colour + text-decoration-line). Neutral throughout — the only azure is the
   keyboard ring, which is action-coded and costs nothing from the viewport
   hue budget because it exists solely on focus. */
const linkClass =
    "text-body-sm text-muted no-underline transition-colors " +
    "[@media(hover:hover)_and_(pointer:fine)]:hover:text-ink " +
    "[@media(hover:hover)_and_(pointer:fine)]:hover:underline " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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
        /* Canvas, not surface: the footer is terminal, so it takes the single
           top rule rather than a .band. No hue anywhere below this line. */
        <footer className="bg-canvas text-ink border-t border-line">
            <div className="container-content section--tight">
                <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
                    {/* 1 — wordmark */}
                    <div className="col-span-2 flex flex-col gap-6 lg:col-span-1">
                        {/* The penguin is retired: a cartoon mascot has nothing to
                            do with a lookout who sees through walls, and the
                            wordmark already carries the idea. */}
                        <Wordmark className="text-[26px] text-ink" />
                        <p className="text-body-sm text-muted max-w-[42ch]">
                            Continuous board scanning, resume-scored matching, drafted
                            outreach.
                        </p>
                    </div>

                    {/* 2 — in-page anchors */}
                    <nav aria-label="Page sections">
                        <h2 className="eyebrow text-ink mb-6">On this page</h2>
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
                        <h2 className="eyebrow text-ink mb-6">Account</h2>
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
                        <h2 className="eyebrow text-ink mb-6">Contact</h2>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="mailto:support@lynceus.com"
                                    className={linkClass}
                                >
                                    support@lynceus.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* bottom rule — mt-10 is a real block boundary and stays; the 40px
                    below it was craft-register dead air for one line of legal text. */}
                <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
                    <p className="tabular text-body-sm text-dim">
                        © {new Date().getFullYear()} Lynceus. All rights reserved.
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

                <p className="postscript mt-6">
                    BUILT BY PEOPLE WHO HATED APPLYING TO JOBS
                </p>
            </div>
        </footer>
    );
}
