'use client';

import {
  useTransform,
  motion,
  useScroll,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { useRef } from 'react';

const features: { title: string; description: string }[] = [
  {
    title: 'Resume-Scored Matching',
    description:
      'Every opening is scored against your resume before it reaches you, so the queue is ordered by fit instead of post date.',
  },
  {
    title: 'Company Intel',
    description:
      'The recruiter, the hiring manager, and the person who signs off — named, with a working address.',
  },
  {
    title: 'Drafted Outreach',
    description:
      'A drafted outreach email for each match, written from your resume and the posting itself. You edit it, or you send it.',
  },
  {
    title: 'Real-time Alerts',
    description:
      'A posting that clears your bar reaches you the day it goes up, not the week after.',
  },
  {
    title: 'Resume Analysis',
    description:
      'Where your resume falls short of a specific role, in plain language, one role at a time.',
  },
  {
    title: 'Application Tracker',
    description:
      'Every application, reply, and follow-up date in one list, so nothing quietly goes cold.',
  },
];

const number = (i: number) => String(i + 1).padStart(2, '0');

function StackHeader() {
  return (
    <div className="container-narrow text-center">
      <p className="eyebrow">FEATURES</p>
      <h2 className="display text-h2 text-ink mt-4">Everything the search needs.</h2>
      <p className="text-lead text-muted mt-4 mx-auto max-w-[900px]">
        Six parts of the search, running whether or not you are at your desk.
      </p>
    </div>
  );
}

export default function StackingCards() {
  const container = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Reduced motion: no 600vh sticky stack, no scroll transforms — a flat
  // hairline grid that reads top to bottom (spec §3 Motion, §6).
  if (prefersReducedMotion) {
    return (
      <section className="section bg-paper-alt">
        <StackHeader />
        <div className="container-narrow mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <article
                key={`feature_${i}`}
                className="border border-hairline bg-paper p-6 md:p-10"
              >
                <span className="eyebrow">{number(i)}</span>
                <h3 className="display text-h3 text-ink mt-6">{feature.title}</h3>
                <p className="text-body text-muted mt-4">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={container} className="relative bg-paper-alt">
      {/* Header — sticks while the stack scrolls beneath it */}
      <div className="sticky top-0 z-10 bg-paper-alt section--tight">
        <StackHeader />
      </div>

      <div className="relative">
        {features.map((feature, i) => {
          const targetScale = 1 - (features.length - i) * 0.05;
          return (
            <Card
              key={`feature_${i}`}
              i={i}
              title={feature.title}
              description={feature.description}
              progress={scrollYProgress}
              range={[i * 0.15, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 24}px)`,
        }}
        className="relative -top-[10%] w-[90%] max-w-[900px] origin-top"
      >
        <motion.div
          style={{ opacity }}
          className="border border-hairline bg-paper p-6 md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-[120px_1fr] md:gap-10">
            <div>
              <span className="eyebrow">{number(i)}</span>
            </div>

            <div>
              <h3 className="display text-h3 text-ink">{title}</h3>
              <p className="text-body text-muted mt-4">{description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
