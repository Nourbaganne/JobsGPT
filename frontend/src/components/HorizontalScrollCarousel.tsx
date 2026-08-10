'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

// Throttle utility for resize handler
function throttle<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
    let shouldWait = false;
    return function throttledFunction(...args: A) {
        if (!shouldWait) {
            fn(...args);
            shouldWait = true;
            setTimeout(() => (shouldWait = false), wait);
        }
    };
}

// Hook to get element's scroll position range
function useElementViewportPosition(ref: React.RefObject<HTMLElement | null>) {
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (!ref || !ref.current) return;

        const updatePosition = () => {
            if (!ref.current) return;
            const pageHeight = document.body.scrollHeight - window.innerHeight;
            const start = ref.current.offsetTop;
            const end = start + ref.current.offsetHeight - window.innerHeight;

            // Clamp values between 0 and 1
            const startRatio = Math.max(0, Math.min(1, start / pageHeight));
            const endRatio = Math.max(0, Math.min(1, end / pageHeight));

            setPosition([startRatio, endRatio]);
        };

        // Initial calculation
        updatePosition();

        // Recalculate on resize
        window.addEventListener('resize', updatePosition);

        // Recalculate after DOM settles
        const timeouts = [
            setTimeout(updatePosition, 100),
            setTimeout(updatePosition, 500),
            setTimeout(updatePosition, 1000),
        ];

        return () => {
            window.removeEventListener('resize', updatePosition);
            timeouts.forEach(clearTimeout);
        };
    }, [ref]);

    return { position };
}

interface Step {
    number: string;
    title: string;
    description: string;
}

// The five steps live inside the component — it takes no props.
const STEPS: readonly Step[] = [
    {
        number: '01',
        title: 'Upload your resume',
        description:
            'One PDF. We read the roles, the tools and the years, and that becomes the profile every posting is scored against.',
    },
    {
        number: '02',
        title: 'Set your bar',
        description:
            'Title, location, salary floor, remote or on-site. Anything below the bar never reaches you.',
    },
    {
        number: '03',
        title: 'We scan continuously',
        description:
            'Ten boards, checked around the clock. A new posting is scored against your resume within minutes of going live.',
    },
    {
        number: '04',
        title: 'Review the queue',
        description:
            'Each match arrives with its score and the reason behind it. Keep what fits and clear the rest in one pass.',
    },
    {
        number: '05',
        title: 'Send the outreach',
        description:
            'We find the person actually doing the hiring and draft the email. You read it, change what you want, hit send.',
    },
];

function StepCard({ step }: { step: Step }) {
    return (
        <li className="shrink-0">
            <article className="hairline-box hairline-box--hover bg-paper flex h-[380px] w-[320px] flex-col p-10">
                <span className="font-mono text-h2 leading-none text-muted">{step.number}</span>
                <h3 className="display mt-auto text-h3 text-ink">{step.title}</h3>
                <p className="mt-4 text-body-sm text-muted">{step.description}</p>
            </article>
        </li>
    );
}

function SectionHeader() {
    return (
        <header className="w-full max-w-[900px] px-6">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 id="how-it-works-heading" className="display mt-4 text-h2 text-ink">
                Five steps, start to <span className="editorial-accent">sent</span>.
            </h2>
            <p className="mt-4 text-lead text-muted">
                You do the first two. The rest runs without you.
            </p>
        </header>
    );
}

function ScrollIndicator() {
    return (
        <div className="eyebrow flex w-full items-center gap-4 px-6">
            <span>01 / 05</span>
            <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
            <span>DRAG OR SCROLL</span>
        </div>
    );
}

export default function HorizontalScrollCarousel() {
    const mainRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLOListElement>(null);
    const { position } = useElementViewportPosition(mainRef);
    const [carouselEndPosition, setCarouselEndPosition] = useState(0);
    const { scrollYProgress } = useScroll();
    const prefersReducedMotion = useReducedMotion();

    // Transform scroll progress to horizontal position
    const x = useTransform(scrollYProgress, position, [0, carouselEndPosition]);

    // Calculate how far the carousel needs to move
    useEffect(() => {
        if (!carouselRef.current) return;

        const parent = carouselRef.current.parentElement;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        const calculateEndPosition = () => {
            if (carouselRef.current && parent) {
                const carouselWidth = carouselRef.current.scrollWidth;
                const viewportWidth = window.innerWidth;
                const parentOffset = (parent as HTMLElement).offsetLeft;

                // End position = how far left we need to scroll to see the last card
                const endPosition = carouselWidth - viewportWidth + scrollbarWidth + parentOffset * 2;
                setCarouselEndPosition(-endPosition);
            }
        };

        calculateEndPosition();

        const handleResize = throttle(calculateEndPosition, 10);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reduced motion: no scroll-jack, no 300vh spacer — a plain scrollable row.
    if (prefersReducedMotion) {
        return (
            <section ref={mainRef} aria-labelledby="how-it-works-heading" className="section bg-paper">
                <SectionHeader />
                <div className="mt-10 overflow-x-auto">
                    <ol className="flex w-max gap-10 px-6">
                        {STEPS.map((step) => (
                            <StepCard key={step.number} step={step} />
                        ))}
                    </ol>
                </div>
                <div className="mt-10">
                    <ScrollIndicator />
                </div>
            </section>
        );
    }

    return (
        <section ref={mainRef} aria-labelledby="how-it-works-heading" className="bg-paper">
            {/* Container with scroll height - this creates the scroll distance */}
            <div className="w-full mx-auto" style={{ height: '300vh' }}>
                {/* Sticky container - stays in view while scrolling */}
                <div className="sticky top-0 flex h-screen w-full flex-col justify-center gap-10 overflow-hidden bg-paper">
                    <SectionHeader />

                    {/* Horizontal Carousel */}
                    <motion.ol ref={carouselRef} className="flex w-max gap-10 px-6" style={{ x }}>
                        {STEPS.map((step) => (
                            <StepCard key={step.number} step={step} />
                        ))}
                    </motion.ol>

                    <ScrollIndicator />
                </div>
            </div>
        </section>
    );
}
