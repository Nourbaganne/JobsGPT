"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { useAuth } from "@/hooks/useAuth";
import Wordmark from "@/components/Wordmark";

/** Fixed bar is 64px (--nav-height) + 16px of air on scroll-to. Ladder value. */
const NAV_OFFSET = 80;

/** Anchor list per spec §6. ids are owned by page.tsx. */
const NAV_LINKS = [
    { id: "how-it-works", label: "HOW IT WORKS" },
    { id: "features", label: "FEATURES" },
    { id: "pricing", label: "PRICING" },
    { id: "faq", label: "FAQ" },
] as const;

/** Keyboard ring, matched to HomeFooter. Only azure in the file, and it is
    action-coded by definition — it exists solely on focus, so it never spends
    from the 2-hue viewport budget. */
const FOCUS_RING =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Minimal shape of the Lenis instance some setups park on `window`. */
type LenisLike = {
    scrollTo: (
        target: HTMLElement,
        options?: { offset?: number; duration?: number }
    ) => void;
};

export default function HomeNavbar() {
    const { isAuthenticated } = useAuth();
    const lenis = useLenis();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    // Bottom rule appears only once scrolled; active anchor gets the ink underline.
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 16);

            const probe = window.scrollY + NAV_OFFSET + 24;
            let current = "";
            for (const { id } of NAV_LINKS) {
                const element = document.getElementById(id);
                if (!element) continue;
                const rect = element.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                if (probe >= top && probe < top + rect.height) {
                    current = id;
                    break;
                }
            }
            setActiveSection(current);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

    const handleSmoothScroll = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
            e.preventDefault();
            setMobileMenuOpen(false);

            const element = document.querySelector<HTMLElement>(href);
            if (!element) return;

            const target = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

            // Reduced motion: jump, never animate.
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                window.scrollTo({ top: target, behavior: "auto" });
                return;
            }

            if (lenis) {
                lenis.scrollTo(element, { offset: -NAV_OFFSET, duration: 1.5 });
                return;
            }

            const globalLenis = (window as unknown as { lenis?: LenisLike }).lenis;
            if (globalLenis) {
                globalLenis.scrollTo(element, { offset: -NAV_OFFSET, duration: 1.5 });
                return;
            }

            window.scrollTo({ top: target, behavior: "smooth" });
        },
        [lenis]
    );

    /* Veil raised 80 → 90 for the indigo ladder. The surface step is not the
       problem; the hues are. At 80% a fifth of whatever passes under the bar
       came through the blur, so mint meters, azure CTAs and amber chips smeared
       colour into a bar that is specified neutral-only. 90% halves that to a
       tint below the perceptual floor while the blur stays legible, and it also
       leaves the bar readable where backdrop-filter is unsupported. */
    return (
        <nav
            aria-label="Main"
            className={`fixed inset-x-0 top-0 z-50 bg-canvas/90 border-b transition-colors duration-200 ${
                scrolled ? "border-line" : "border-transparent"
            }`}
            style={{
                backdropFilter: "blur(var(--nav-blur))",
                WebkitBackdropFilter: "blur(var(--nav-blur))",
            }}
        >
            <div className="container-content">
                <div className="flex h-[var(--nav-height)] items-center justify-between gap-6">
                    {/* Typographic wordmark — the PNG is retired from the nav (P1).
                        No status dot here: the hero already spends the accent budget. */}
                    <Link
                        href="/"
                        aria-label="Lynceus — home"
                        className={`flex items-center ${FOCUS_RING}`}
                    >
                        <Wordmark className="text-[22px] text-ink" />
                    </Link>

                    {/* Desktop anchors — mono uppercase, ink underline marks the active section */}
                    <div className="hidden items-center gap-10 lg:flex">
                        {NAV_LINKS.map(({ id, label }) => {
                            const isActive = activeSection === id;
                            return (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    onClick={(e) => handleSmoothScroll(e, `#${id}`)}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`group relative block py-2 font-mono text-eyebrow uppercase tracking-[0.08em] transition-colors duration-200 ${FOCUS_RING} [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink ${
                                        isActive ? "text-ink" : "text-muted"
                                    }`}
                                >
                                    {label}
                                    <span
                                        aria-hidden="true"
                                        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-200 ${
                                            isActive
                                                ? "scale-x-100"
                                                : "scale-x-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            );
                        })}
                    </div>

                    {/* Desktop actions — anchors only, never <button> (P10) */}
                    <div className="hidden items-center gap-6 lg:flex">
                        {/* Secondary, not primary: the hero CTA already spends the
                            accent, and P6 caps it at 3 elements per viewport. */}
                        {isAuthenticated ? (
                            <Link href="/dashboard" className="cta cta--secondary">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="cta cta--ghost">
                                    Sign in
                                </Link>
                                <Link href="/auth/register" className="cta cta--secondary">
                                    Start free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Genuine UI toggle — the one allowed <button> */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="home-nav-mobile"
                        className={`inline-flex items-center justify-center p-2 text-muted transition-colors duration-200 lg:hidden ${FOCUS_RING} [@media(hover:hover)_and_(pointer:fine)]:hover:bg-panel-2 [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink`}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-4 w-4" strokeWidth={1.5} />
                        ) : (
                            <Menu className="h-4 w-4" strokeWidth={1.5} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile panel — full-width canvas, 1px line dividers, mono anchors.
                border-y, not border-t: the sheet is canvas-on-canvas now, so
                without a closing rule its bottom edge simply dissolves. */}
            {mobileMenuOpen && (
                <div
                    id="home-nav-mobile"
                    className="border-y border-line bg-canvas lg:hidden"
                >
                    <div className="container-content">
                        {NAV_LINKS.map(({ id, label }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                onClick={(e) => handleSmoothScroll(e, `#${id}`)}
                                aria-current={activeSection === id ? "true" : undefined}
                                className={`block border-b border-line py-4 font-mono text-eyebrow uppercase tracking-[0.08em] ${FOCUS_RING} ${
                                    activeSection === id ? "text-ink" : "text-muted"
                                }`}
                            >
                                {label}
                            </a>
                        ))}

                        <div className="flex flex-col gap-4 py-6">
                            {isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    onClick={closeMenu}
                                    className="cta cta--secondary w-full justify-center"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        onClick={closeMenu}
                                        className="cta cta--ghost"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        onClick={closeMenu}
                                        className="cta cta--secondary w-full justify-center"
                                    >
                                        Start free
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
