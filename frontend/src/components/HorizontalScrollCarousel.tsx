'use client';

import type { MotionValue } from 'motion/react';
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

// Hook to get element's scroll position range.
// `pinRef` is the sticky child: the animation must finish exactly when that
// child unpins, which happens once the section's bottom meets the child's
// bottom — i.e. after (section height − pin height) of scroll. Measuring the
// pin instead of assuming a viewport-tall one keeps the range honest whatever
// height it settles at. `revision` re-measures when the spacer is resized.
function useElementViewportPosition(
    ref: React.RefObject<HTMLElement | null>,
    pinRef?: React.RefObject<HTMLElement | null>,
    revision?: number | null,
) {
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (!ref || !ref.current) return;

        const updatePosition = () => {
            if (!ref.current) return;
            const pageHeight = document.body.scrollHeight - window.innerHeight;
            const pinHeight = pinRef?.current?.offsetHeight ?? window.innerHeight;
            const start = ref.current.offsetTop;
            const end = start + ref.current.offsetHeight - pinHeight;

            // Clamp values between 0 and 1
            const startRatio = Math.max(0, Math.min(1, start / pageHeight));
            const endRatio = Math.max(0, Math.min(1, end / pageHeight));

            // Once the row fits the viewport the spacer collapses to the pin
            // height and start meets end. A zero-width input range makes the
            // interpolation divide by zero, so keep it strictly increasing.
            setPosition([startRatio, Math.max(endRatio, startRatio + 1e-9)]);
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
    }, [ref, pinRef, revision]);

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
        description: 'One PDF.',
    },
    {
        number: '02',
        title: 'Set your bar',
        description: 'Title, location, salary floor, remote or not.',
    },
    {
        number: '03',
        title: 'We scan continuously',
        description: 'Ten boards, around the clock.',
    },
    {
        number: '04',
        title: 'Review the queue',
        description: 'Ranked by fit, with the reason.',
    },
    {
        number: '05',
        title: 'Send the outreach',
        description: 'Drafted for you. You hit send.',
    },
];

// The step numbers trace the state machine, so the figure carries the state:
// 01–02 are setup and stay neutral, 03 is the scan (amber), 04 is the matched
// queue (mint), 05 is the AI-drafted outreach (violet).
const STEP_TONE: Record<string, string> = {
    '01': 'text-dim',
    '02': 'text-dim',
    '03': 'text-amber',
    '04': 'text-mint',
    '05': 'text-violet',
};

function StepCard({ step }: { step: Step }) {
    const tone = STEP_TONE[step.number] ?? 'text-dim';

    return (
        <li className="shrink-0">
            <article className="panel panel--hover flex h-full w-[320px] flex-col overflow-hidden">
                <div className="panel__header">
                    <span className={`tabular text-h3 leading-none tracking-normal ${tone}`}>
                        {step.number}
                    </span>
                </div>
                <div className="panel__body">
                    <h3 className="display text-h3 text-ink">{step.title}</h3>
                    <p className="mt-4 text-body-sm text-muted">{step.description}</p>
                </div>
            </article>
        </li>
    );
}

function SectionHeader() {
    return (
        <header className="w-full max-w-[900px] px-6">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 id="how-it-works-heading" className="display mt-4 text-h2 text-muted">
                Five steps, start to <span className="text-ink">sent</span>.
            </h2>
            <p className="mt-4 text-lead text-muted">The rest runs without you.</p>
        </header>
    );
}

// The track is a run meter, so it uses the .meter primitive. It is navigation
// chrome, not product state, so the fill overrides .meter__fill's mint with a
// neutral bg-muted — the hues in this section belong to the steps.
// Without a progress value (reduced motion) it renders as an empty track.
function ScrollIndicator({ progress }: { progress?: MotionValue<number> }) {
    return (
        <div className="eyebrow flex w-full items-center gap-4 px-6 text-dim">
            <span className="tabular">01 / 05</span>
            <span aria-hidden="true" className="meter relative flex-1">
                {progress ? (
                    <motion.span
                        className="meter__fill absolute inset-0 origin-left bg-muted"
                        style={{ scaleX: progress }}
                    />
                ) : null}
            </span>
            <span>DRAG OR SCROLL</span>
        </div>
    );
}

export default function HorizontalScrollCarousel() {
    const mainRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLOListElement>(null);
    const [carouselEndPosition, setCarouselEndPosition] = useState(0);
    const [spacerHeight, setSpacerHeight] = useState<number | null>(null);
    const { position } = useElementViewportPosition(mainRef, pinRef, spacerHeight);
    const { scrollYProgress } = useScroll();
    const prefersReducedMotion = useReducedMotion();

    // Transform scroll progress to horizontal position
    const x = useTransform(scrollYProgress, position, [0, carouselEndPosition]);

    // Same range, normalised — drives the run meter under the carousel
    const progress = useTransform(scrollYProgress, position, [0, 1]);

    // Calculate how far the carousel needs to move, and buy exactly that much
    // scroll for it.
    useEffect(() => {
        if (!carouselRef.current) return;

        const calculateEndPosition = () => {
            if (!carouselRef.current) return;

            const carouselWidth = carouselRef.current.scrollWidth;

            // Travel = how far left the row must move for card 05 to land at the
            // right edge. The row is 1808px wide (5 × 320 + 4 × 40 gap + 2 × 24
            // padding), so at a content width of 1808px and up this goes negative
            // — which would translate the row RIGHT and push every card
            // off-screen. There is nothing to reveal then, so clamp it to 0.
            const travel = Math.max(0, carouselWidth - document.documentElement.clientWidth);
            setCarouselEndPosition(-travel);

            // The spacer is the pin plus exactly the travel, so one pixel of
            // scroll buys one pixel of motion. When the travel is 0 it collapses
            // to the pin height and the section stops charging scroll for a row
            // that never moves.
            setSpacerHeight((pinRef.current?.offsetHeight ?? window.innerHeight) + travel);
        };

        calculateEndPosition();

        const handleResize = throttle(calculateEndPosition, 10);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reduced motion: no scroll-jack, no spacer — a plain scrollable row.
    if (prefersReducedMotion) {
        return (
            <section ref={mainRef} aria-labelledby="how-it-works-heading" className="section bg-canvas">
                <SectionHeader />
                <div className="mt-6 overflow-x-auto">
                    <ol className="flex w-max gap-10 px-6">
                        {STEPS.map((step) => (
                            <StepCard key={step.number} step={step} />
                        ))}
                    </ol>
                </div>
                <div className="mt-6">
                    <ScrollIndicator />
                </div>
            </section>
        );
    }

    return (
        <section ref={mainRef} aria-labelledby="how-it-works-heading" className="bg-canvas">
            {/* Container with scroll height — this creates the scroll distance.
                Measured, not a constant: see calculateEndPosition. 100vh until
                it is measured, which is the no-travel case. */}
            <div
                className="w-full"
                style={{ height: spacerHeight === null ? '100vh' : `${spacerHeight}px` }}
            >
                {/* Sticky container - stays in view while scrolling.
                    Viewport-tall, so centring the group centres it against what
                    the viewer actually sees and no bare spacer is ever exposed
                    below it. The padding is the floor on the breathing room. */}
                <div
                    ref={pinRef}
                    className="sticky top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas py-[clamp(48px,8vh,96px)]"
                >
                    {/* 1808px is the row's own width. Capping the group there and
                        centring it holds the heading flush to card 01 at every
                        width while stopping the section from hugging the left
                        edge on displays wider than the row. Below 1808px it is a
                        no-op. */}
                    <div className="mx-auto flex w-full max-w-[1808px] flex-col">
                        <SectionHeader />

                        {/* Horizontal Carousel */}
                        <motion.ol
                            ref={carouselRef}
                            className="mt-10 flex w-max gap-10 px-6"
                            style={{ x }}
                        >
                            {STEPS.map((step) => (
                                <StepCard key={step.number} step={step} />
                            ))}
                        </motion.ol>

                        {/* 16px, against the header's 40px: the indicator is chrome
                            attached to the row, not a third peer block. */}
                        <div className="mt-4">
                            <ScrollIndicator progress={progress} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
