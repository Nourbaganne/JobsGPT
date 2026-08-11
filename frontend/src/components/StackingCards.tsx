'use client';

import { useTransform, motion, useScroll, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

// The 01–06 number is the only tinted element on each card. All six are on screen
// at once — flat grid under reduced motion, stacked headers in the sticky path —
// so this is one viewport and the 2-hue budget applies to the set, not per card.
// The stack reports two states: what the product finds (mint = matched/live) and
// what it writes (violet = AI-generated). Everything else is neutral `text-dim`.
type Tint = 'text-mint' | 'text-violet' | 'text-dim';

const features: { title: string; description: string; tint: Tint }[] = [
  {
    title: 'Resume-Scored Matching',
    description: 'Ranked by fit, not post date.',
    tint: 'text-mint',
  },
  {
    title: 'Company Intel',
    description: 'The recruiter, the manager, the signer. Named.',
    tint: 'text-dim',
  },
  {
    // One sentence, like the other five. The edit-or-send beat is already told
    // by step 05 of the carousel above ("Drafted for you. You hit send."), so
    // carrying it here made 03 the only two-sentence card in the set.
    title: 'Drafted Outreach',
    description: 'An email per match, written from your resume.',
    tint: 'text-violet',
  },
  {
    title: 'Real-time Alerts',
    description: 'The day it posts, not the week after.',
    tint: 'text-dim',
  },
  {
    title: 'Resume Analysis',
    description: 'Where your resume falls short, per role.',
    tint: 'text-violet',
  },
  {
    title: 'Application Tracker',
    description: 'Every application and reply in one list.',
    tint: 'text-mint',
  },
];

const number = (i: number) => String(i + 1).padStart(2, '0');

// Stack geometry — sized for the short card, not the 900px-wide one this was
// tuned for. The card is ~127px tall (54px header + 72px body), so what the
// stack shows of every card behind the front one is a HEADER, not a card: at the
// old 24px the reveal cut the number and title in half. 40px exposes the whole
// header text and clips only its lower padding, so the stack reads as six
// labelled tabs. The scale step is pulled back to match — at 0.05 a six-card fan
// tapered the card down by a third, which on a card this flat read as collapse
// rather than depth; at 0.03 the hindmost card still recedes to 0.85 while the
// front one lands at 1.
const CARD_OFFSET = 40;
const SCALE_STEP = 0.03;

// === Sticky geometry — pixels, never viewport fractions =====================
// All six containers pin at top-0 at the same time, so where a card lands is
// (clearance + i * CARD_OFFSET) and what the stack needs is (clearance +
// 5 * CARD_OFFSET + one card). Both are pixel sums. The previous `h-[70vh]` +
// `items-center` mixed a viewport fraction into both: the card's top became
// 56.85 + 0.35H, which slid under the header below H≈710 and pushed the front
// two cards through the band rule below H≈1084.

// What sits above the stack: the fixed nav, then the section header pinned
// under it — section--tight padding, a 1px rule, and three type lines (eyebrow
// 11 × 1.4, mt-4, h2 × 1.04, mt-4, lead 17 × 1.5). Spelled in the tokens the
// header is actually built from, so it tracks the <768px overrides
// (≈305px desktop, ≈247px mobile) instead of freezing as one magic 240.
const HEADER_TYPE = 'calc(15.4px + 16px + 1.04 * var(--type-h2) + 16px + 25.5px)';
const HEADER_BLOCK = `calc(var(--section-pad-tight) * 2 + 1px + ${HEADER_TYPE})`;
const STACK_TOP = `calc(var(--nav-height) + ${HEADER_BLOCK} + 32px)`;

// Room below the first card's top for the other five (5 × 40) plus the tallest
// card, with slack for a description that wraps. The container must contain the
// whole stack: the last container's bottom IS the section's band rule, and
// nothing clips it — `overflow-hidden` on the wrapper is not the fix, it would
// turn the wrapper into a scrollport and kill `position: sticky` outright.
const STACK_ROOM = 400;
const CARD_STEP = `calc(${STACK_TOP} + ${STACK_ROOM}px)`;

// Trailing scroll after the last card lands, so the assembled stack is held on
// screen instead of existing for the section's final pixel.
const STACK_HOLD = 400;

function StackHeader() {
  return (
    <div className="container-narrow text-center">
      <p className="eyebrow">FEATURES</p>
      <h2 className="display text-h2 text-ink mt-4">Everything the search needs.</h2>
      <p className="text-lead text-muted mt-4">Six parts, all running.</p>
    </div>
  );
}

// Title bar of every feature panel: tinted identifier, then the name. `normal-case`
// preserves the capitalisation of the title against the mono uppercase header.
function CardHeader({ i, title }: { i: number; title: string }) {
  return (
    <div className="panel__header px-6 py-4 justify-start items-baseline gap-4">
      <span className={`eyebrow tabular ${features[i].tint}`}>{number(i)}</span>
      <h3 className="display text-h3 text-ink normal-case">{title}</h3>
    </div>
  );
}

export default function StackingCards() {
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion: no sticky stack, no scroll transforms — a flat
  // grid of panels that reads top to bottom (spec §Reduced motion).
  if (prefersReducedMotion) {
    return (
      <section className="section bg-surface band">
        <StackHeader />
        <div className="container-narrow mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <article key={`feature_${i}`} className="panel overflow-hidden">
                <CardHeader i={i} title={feature.title} />
                <div className="panel__body">
                  <p className="text-body text-muted">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-surface band">
      {/* Header — sticks while the stack scrolls beneath it */}
      <div className="sticky top-[var(--nav-height)] z-10 bg-surface border-b border-line section--tight">
        <StackHeader />
      </div>

      <div className="relative">
        {features.map((feature, i) => {
          // Every card that lands on this one takes it down one SCALE_STEP, so
          // the fan is evenly tapered at every frame and the front card ends at
          // exactly 1. The old `1 - (length - i) * step` left the front card of
          // the finished stack permanently 3% small.
          const covers = features.length - 1 - i;
          return (
            <Card
              key={`feature_${i}`}
              i={i}
              title={feature.title}
              description={feature.description}
              targetScale={1 - covers * SCALE_STEP}
              // Scale is keyed to the covering cards, not to a slice of section
              // progress. `start start` is the frame this card pins; `N00%
              // start` is the frame N containers later — the frame the last
              // card lands. Both resolve off the container's own height in page
              // pixels, so the timing is exact at any viewport height. The old
              // `[i * 0.15, 1]` had every card deflating 0.13–0.20 of progress
              // before its cover arrived, and put card 06's landing at progress
              // 1.086 — off the end of its own range.
              coverEnd={`${Math.max(covers, 1) * 100}% start`}
            />
          );
        })}

        {/* Keeps the last container pinned for STACK_HOLD more pixels, so the
            assembled six-card stack is held on screen instead of arriving as
            the section leaves. It has to be an element, not padding on the
            wrapper: a sticky child is constrained by its containing block,
            which is the wrapper's CONTENT box — padding would not extend it. */}
        <div aria-hidden="true" style={{ height: `${STACK_HOLD}px` }} />
      </div>
    </section>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  targetScale: number;
  // Kept as a template literal type, not `string`: motion types a scroll offset
  // as `${Edge} ${Edge}`, which a plain string is not assignable to.
  coverEnd: `${number}% start`;
}

const Card: React.FC<CardProps> = ({ i, title, description, targetScale, coverEnd }) => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress: entry } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });
  const { scrollYProgress: covered } = useScroll({
    target: container,
    offset: ['start start', coverEnd],
  });

  const scale = useTransform(covered, [0, 1], [1, targetScale]);
  const opacity = useTransform(entry, [0, 0.5, 1], [0.3, 1, 1]);

  // `items-start` + a pixel padding-top, not `items-center`: the padding has to
  // BE the clearance under the nav and the sticky header, not a floor that
  // centring can undercut. Height is that same clearance plus the stack's own
  // extent, so the last card cannot reach the band rule at the section's edge.
  // Card width is sized to the longest description (~345px at 15px) plus 24px
  // padding either side — 560px was sized for copy that no longer exists and
  // left four of the six descriptions filling under 60% of their column.
  return (
    <div
      ref={container}
      style={{ height: CARD_STEP, paddingTop: STACK_TOP }}
      className="sticky top-0 flex items-start justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `${i * CARD_OFFSET}px`,
        }}
        className="relative w-[90%] max-w-[420px] origin-top"
      >
        <motion.div style={{ opacity }} className="panel overflow-hidden">
          <CardHeader i={i} title={title} />

          <div className="panel__body">
            <p className="text-body text-muted">{description}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
