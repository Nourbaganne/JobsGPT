"use client";

import { useEffect, useRef, useState } from "react";
import { ReactLenis, useLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Full smooth-scroll behaviour. */
const SMOOTH_OPTIONS: LenisOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
};

/**
 * prefers-reduced-motion: hand the wheel and touch back to the browser, so the
 * page scrolls natively with no interpolation. Lenis stays mounted only so the
 * context (and the scroll-progress callback) keeps working for consumers such
 * as the navbar anchor handler; `lerp: 1` with no duration/easing makes any
 * programmatic scrollTo resolve in a couple of frames instead of animating.
 */
const REDUCED_MOTION_OPTIONS: LenisOptions = {
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: false,
    syncTouch: false,
    lerp: 1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
};

/**
 * SSR-safe reduced-motion subscription. The initial value is read lazily so the
 * first client render is already correct — no setState-in-effect cascade. On the
 * server it falls back to false; nothing this provider renders depends on the
 * value (with `root`, ReactLenis renders children directly and the options only
 * drive JS behaviour), so there is no hydration mismatch.
 */
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches
    );

    useEffect(() => {
        const query = window.matchMedia(REDUCED_MOTION_QUERY);

        const onChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    return prefersReducedMotion;
}

// Scroll animations observer component
function ScrollAnimations({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    // Create scroll progress bar — solid 2px accent hairline, no gradient.
    useEffect(() => {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: var(--accent);
            border-radius: 0;
            z-index: 9999;
            transition: width 0.1s ease-out;
            pointer-events: none;
        `;
        document.body.appendChild(progressBar);
        progressBarRef.current = progressBar;

        return () => {
            progressBar.remove();
            progressBarRef.current = null;
        };
    }, []);

    // Update progress bar on scroll (Lenis emits on native scroll too, so this
    // keeps tracking under reduced motion where smooth wheel is off).
    useLenis(({ scroll, limit }) => {
        if (progressBarRef.current && limit > 0) {
            const progress = (scroll / limit) * 100;
            progressBarRef.current.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    });

    // Intersection Observer for scroll animations
    useEffect(() => {
        // Reduced motion: globals.css already pins `.scroll-animate` to its
        // final state, so the reveal must not run at all.
        if (prefersReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-view');
                    // The reveal is one-way; stop watching once it has fired.
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const observeElements = () => {
            document
                .querySelectorAll('.scroll-animate:not(.animate-in-view)')
                .forEach((el) => {
                    observer.observe(el);
                });
        };

        // Coalesce bursts of DOM mutations into a single scan per frame.
        let frame = 0;
        const scheduleScan = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                observeElements();
            });
        };

        // Initial observation — effects run after the tree is committed to the DOM.
        observeElements();

        // Replaces the old setInterval poll: react to nodes actually entering
        // the tree instead of re-querying the whole document every second.
        // `childList` only, so adding `animate-in-view` cannot feed back in.
        const mutationObserver = new MutationObserver(scheduleScan);
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            if (frame) cancelAnimationFrame(frame);
            mutationObserver.disconnect();
            observer.disconnect();
        };
    }, [prefersReducedMotion]);

    return null;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <ReactLenis
            root
            options={prefersReducedMotion ? REDUCED_MOTION_OPTIONS : SMOOTH_OPTIONS}
        >
            <ScrollAnimations prefersReducedMotion={prefersReducedMotion} />
            {children}
        </ReactLenis>
    );
}
