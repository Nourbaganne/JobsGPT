"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from 'lenis/react';

// Scroll animations observer component
function ScrollAnimations() {
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    // Create scroll progress bar
    useEffect(() => {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #4a4e69, #9a8c98);
            z-index: 9999;
            transition: width 0.1s ease-out;
            pointer-events: none;
        `;
        document.body.appendChild(progressBar);
        progressBarRef.current = progressBar;

        return () => {
            progressBar.remove();
        };
    }, []);

    // Update progress bar on scroll
    useLenis(({ scroll, limit }) => {
        if (progressBarRef.current && limit > 0) {
            const progress = (scroll / limit) * 100;
            progressBarRef.current.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    });

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const observeElements = () => {
            document.querySelectorAll('.scroll-animate').forEach((el) => {
                observer.observe(el);
            });
        };

        // Initial observation
        setTimeout(observeElements, 100);

        // Re-observe for dynamic content
        const interval = setInterval(observeElements, 1000);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    return null;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis 
            root 
            options={{
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            <ScrollAnimations />
            {children}
        </ReactLenis>
    );
}
