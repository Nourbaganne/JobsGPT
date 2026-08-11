import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import HorizontalScrollCarousel from "@/components/HorizontalScrollCarousel";
import StackingCards from "@/components/StackingCards";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Marquee } from "@/components/ui/marquee";

/* ---------------------------------------------------------------------------
   Static content — kept out of the JSX so the markup stays readable.
   -------------------------------------------------------------------------- */

const QUEUE_ROWS = [
  { role: "Senior Backend Engineer", company: "Northwind", match: "94" },
  { role: "Platform Engineer", company: "Cadence Labs", match: "88" },
  { role: "Infrastructure Engineer", company: "Halcyon", match: "81" },
  { role: "Backend Engineer", company: "Meridian", match: "76" },
];

const BOARDS = [
  "LINKEDIN",
  "INDEED",
  "GREENHOUSE",
  "LEVER",
  "WORKDAY",
  "ASHBY",
  "WELLFOUND",
  "SMARTRECRUITERS",
  "BAMBOOHR",
  "RECRUITEE",
];

const COMPARISON_ROWS = [
  { label: "Time spent searching", manual: "Hours a day", lynceus: "Minutes a day" },
  { label: "Recruiter contacts", manual: "Manual research", lynceus: "In the record" },
  { label: "Outreach", manual: "Generic template", lynceus: "Drafted per role" },
  { label: "Company context", manual: "Whatever is public", lynceus: "Leadership, named" },
  { label: "Tracking", manual: "A spreadsheet", lynceus: "Built in" },
  { label: "Ranking", manual: "Post date", lynceus: "Resume-scored" },
];

/* Numbers band — all four bars share one viewport, so the band gets two hues,
   not three: mint for what was matched, amber for the scan that never stops.
   Companies covered is a plain count, not a state, so it reads in neutral.
   Proportions are presentational: they encode the figure's relative reading. */
const STAT_METERS = [
  { fill: "", width: "92%" },                        /* jobs matched   → mint    */
  { fill: "bg-line-strong", width: "78%" },          /* companies      → neutral */
  { fill: "", width: "95%" },                        /* satisfaction   → mint    */
  { fill: "meter__fill--amber", width: "100%" },     /* always scanning→ amber   */
];

const PLANS = [
  {
    name: "Starter",
    note: "To try it.",
    price: "$9",
    credits: "50 CREDITS",
    marked: false,
    features: [
      "50 searches",
      "25 drafted emails",
      "16 company reports",
    ],
  },
  {
    name: "Pro",
    note: "For a live search.",
    price: "$29",
    credits: "240 CREDITS · 40 FREE",
    marked: true,
    features: [
      "240 searches",
      "120 drafted emails",
      "80 company reports",
    ],
  },
  {
    name: "Enterprise",
    note: "For teams. API access.",
    price: "$79",
    credits: "780 CREDITS · 180 FREE",
    marked: false,
    features: [
      "780 searches",
      "390 drafted emails",
      "260 company reports",
    ],
  },
];

const LEDGER = ["JOB SEARCH · 1 CREDIT", "AI EMAIL · 2 CREDITS", "COMPANY INTEL · 3 CREDITS"];

/* A price label is not an action — there is nothing here to click — so the two
   ordinary rows read in neutral. Violet marks the one line that is AI work, and
   because it is the only hue in the set it is the only thing the colour says. */
const LEDGER_HUE = ["text-dim", "text-violet", "text-dim"];

const QUOTES = [
  {
    quote:
      "Three interviews in two weeks. I never opened a job board.",
    attribution: "SARAH M. · HIRED IN 6 WEEKS",
  },
  {
    quote:
      "I read the queue over coffee and send two or three emails.",
    attribution: "JAMES C. · HIRED IN 9 WEEKS",
  },
  {
    quote:
      "It read the transferable half of my resume better than I could.",
    attribution: "EMILY P. · HIRED IN 11 WEEKS",
  },
];

const FAQS = [
  {
    question: "How do credits work?",
    answer:
      "One credit a search, two a drafted email, three a company report. They don't expire.",
  },
  {
    question: "How good is the matching?",
    answer:
      "Every opening is scored against your resume and the bar you set. You see that score before you spend a credit.",
  },
  {
    question: "Can I get a refund on unused credits?",
    answer:
      "Yes, within 14 days, on anything you have not spent.",
  },
  {
    question: "Where do the contact details come from?",
    answer:
      "Public sources and our own database, re-verified on a schedule.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Encrypted in transit and at rest. Never sold, never shared without you.",
  },
];

/* Shared column template for the match-queue panel — role · company · match.
   Fixed tracks so every row aligns with the header labels above it. */
const QUEUE_GRID = "grid grid-cols-[minmax(0,1fr)_96px_80px] items-center gap-4";

/* Numbers-band figures. `.tabular` is declared after `.display` in globals.css
   at equal specificity, so on an element carrying both, tabular's mono face wins
   the font-family cascade — these figures have always rendered in mono, which is
   right for a control surface. Say so outright instead of inheriting it from a
   class whose face is being silently overridden, and take the h2 tracking:
   --track-h1 was cut for a 62px sans, not for mono at 38px. */
const FIGURE =
  "tabular text-h2 font-semibold leading-[1.04] tracking-[var(--track-h2)] text-ink";

/* ---------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <HomeNavbar />

      {/* 01 — HERO -------------------------------------------------------- */}
      {/* Hues: mint (queue state) + azure (action). Nothing else. */}
      <header
        id="home"
        className="section section--tight relative overflow-hidden bg-canvas pt-[var(--hero-pad-top)]"
      >
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />

        <div className="container-content relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-30">
            {/* Left — copy */}
            <div className="scroll-animate">
              <p className="status">
                <span className="status__dot queue-pulse" aria-hidden="true" />
                AUTOMATED JOB SEARCH
              </p>

              <h1 className="display text-h1 mt-6 text-ink">
                We run the search.
                <br />
                You take the <span className="mark">interview</span>.
              </h1>

              <p className="text-lead mt-6 max-w-[52ch] text-muted">
                We watch every board, rank every opening against your resume, and draft the email.
              </p>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link href="/auth/register" className="cta cta--primary">
                  Start free
                  <span className="font-mono" aria-hidden="true">
                    →
                  </span>
                </Link>
                <a href="#how-it-works" className="cta cta--secondary">
                  See how it runs
                </a>
              </div>

              <p className="postscript mt-6">
                NO SUBSCRIPTION · CREDITS DON&apos;T EXPIRE · NO DEMO TO BOOK
              </p>
            </div>

            {/* Right — match queue panel (data surface, layered not shadowed) */}
            <div className="scroll-animate scroll-stagger-2">
              <div className="panel overflow-hidden">
                <div className="panel__header">
                  <span>MATCH QUEUE</span>
                  <span className="chip chip--live">LIVE</span>
                </div>

                <div className="relative overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="scan-sweep pointer-events-none absolute inset-x-0 top-0 z-10 h-[8%] border-t border-line-strong"
                  />

                  <div
                    className={`eyebrow ${QUEUE_GRID} border-b border-line bg-panel-2 px-4 py-2 text-dim`}
                  >
                    <span>ROLE</span>
                    <span>COMPANY</span>
                    <span className="text-right">MATCH</span>
                  </div>

                  {QUEUE_ROWS.map((row, i) => (
                    <div key={row.role} className={`panel__row panel__row--hover ${QUEUE_GRID}`}>
                      <span className="text-body-sm min-w-0 truncate text-ink">{row.role}</span>
                      <span className="text-body-sm min-w-0 truncate text-muted">
                        {row.company}
                      </span>
                      <span className="flex flex-col items-end gap-2">
                        <span
                          className={`tabular text-body-sm ${i === 0 ? "text-mint" : "text-muted"}`}
                        >
                          {row.match}
                        </span>
                        {/* Mint is the matched state, so only the top match spends
                            it — figure and bar are one datum. The rest of the queue
                            reads in neutral so the leader stays legible. */}
                        <span className="meter block w-full">
                          <span
                            aria-hidden="true"
                            className={`meter__fill meter-fill block ${
                              i === 0 ? "" : "bg-line-strong"
                            }`}
                            style={{ width: `${row.match}%` }}
                          />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                <p className="eyebrow border-t border-line px-4 py-4 text-dim">
                  RESCANNED CONTINUOUSLY · YOU REVIEW BEFORE ANYTHING SENDS
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — BOARD STRIP ------------------------------------------------- */}
      {/* Hue: amber only — the strip is a scan in progress. The closing rule is
          supplied by the manifesto's .band below, so this section carries a top
          rule alone — two stacked 1px borders would read as a 2px seam. */}
      <section className="border-t border-line bg-canvas py-8">
        <div className="container-content">
          <p className="chip chip--scan">CONTINUOUSLY SCANNING</p>
        </div>
        <div className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee className="[--duration:40s] [--gap:40px]">
            {BOARDS.map((board) => (
              <span key={board} className="eyebrow text-body-sm shrink-0 text-dim">
                {board}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* 03 — MANIFESTO INTERRUPT ----------------------------------------- */}
      {/* No hue. Rules above and below turn the band into a deliberate cut. */}
      <section className="section section--tight band bg-surface">
        <div className="container-content">
          <div className="scroll-animate max-w-[72ch]">
            <hr className="rule" />
            <p className="postscript text-h3 py-6 text-muted">
              THE AVERAGE SEARCH TAKES FIVE MONTHS. MOST OF THAT IS TABS.
            </p>
            <hr className="rule" />
          </div>
        </div>
      </section>

      {/* 04 — HOW IT WORKS ------------------------------------------------ */}
      <div id="how-it-works">
        <HorizontalScrollCarousel />
      </div>

      {/* 05 — FEATURE STACK ----------------------------------------------- */}
      <div id="features">
        <StackingCards />
      </div>

      {/* 06 — COMPARISON -------------------------------------------------- */}
      {/* Hue: mint on the Lynceus column head only. The heading marks its key
          word by weight of tone, not by colour — azure is reserved for action. */}
      <section className="section bg-canvas">
        <div className="container-narrow">
          <div className="scroll-animate mb-10 max-w-[56ch]">
            <h2 className="display text-h2 text-muted">
              Two ways to run the <span className="text-ink">same</span> search.
            </h2>
            <p className="text-lead mt-6 text-muted">The difference is who does the reading.</p>
          </div>

          <div className="panel scroll-animate scroll-stagger-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="matrix min-w-[640px]">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Capability</span>
                    </th>
                    <th scope="col">DOING IT YOURSELF</th>
                    <th scope="col" className="bg-mint-dim text-mint">
                      WITH LYNCEUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="text-body font-medium text-ink">
                        {row.label}
                      </th>
                      <td className="text-body text-dim">
                        <span className="font-mono mr-2 text-dim" aria-hidden="true">
                          —
                        </span>
                        {row.manual}
                      </td>
                      <td className="text-body text-ink">{row.lynceus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — NUMBERS BAND ------------------------------------------------ */}
      {/* Each figure carries a meter: matched → mint, scanning → amber, coverage
          neutral. The bars declare their width rather than sweeping to it — this
          band sits five viewports down, and a load-triggered CSS animation has
          finished long before anyone arrives, while the counters beside them are
          in-view gated. A bar at full width under a figure still counting up is
          worse than no animation at all. */}
      <section className="section section--tight band bg-surface">
        <div className="container-content">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="px-6">
              <p className={FIGURE}>
                <AnimatedCounter end={10000} suffix="+" />
              </p>
              <span className="meter mt-4 block w-full">
                <span
                  aria-hidden="true"
                  className={`meter__fill block ${STAT_METERS[0].fill}`}
                  style={{ width: STAT_METERS[0].width }}
                />
              </span>
              {/* The dot is hardcoded mint and mint is the matched state, so it
                  belongs under this figure and nowhere else in the band. */}
              <p className="eyebrow status mt-4 text-dim">
                <span className="status__dot" aria-hidden="true" />
                JOBS MATCHED
              </p>
            </div>
            <div className="border-l border-line px-6">
              <p className={FIGURE}>
                <AnimatedCounter end={500} suffix="+" />
              </p>
              <span className="meter mt-4 block w-full">
                <span
                  aria-hidden="true"
                  className={`meter__fill block ${STAT_METERS[1].fill}`}
                  style={{ width: STAT_METERS[1].width }}
                />
              </span>
              <p className="eyebrow mt-4 text-dim">COMPANIES COVERED</p>
            </div>
            <div className="mt-6 px-6 md:mt-0 md:border-l md:border-line">
              <p className={FIGURE}>
                <AnimatedCounter end={95} suffix="%" />
              </p>
              <span className="meter mt-4 block w-full">
                <span
                  aria-hidden="true"
                  className={`meter__fill block ${STAT_METERS[2].fill}`}
                  style={{ width: STAT_METERS[2].width }}
                />
              </span>
              <p className="eyebrow mt-4 text-dim">MATCH SATISFACTION</p>
            </div>
            <div className="mt-6 border-l border-line px-6 md:mt-0">
              <p className={FIGURE}>24/7</p>
              <span className="meter mt-4 block w-full">
                <span
                  aria-hidden="true"
                  className={`meter__fill block ${STAT_METERS[3].fill}`}
                  style={{ width: STAT_METERS[3].width }}
                />
              </span>
              <p className="eyebrow mt-4 text-dim">ALWAYS SCANNING</p>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — PRICING ----------------------------------------------------- */}
      {/* Hues: azure (the chosen action) + violet (the AI-drafted credit line). */}
      <section id="pricing" className="section bg-canvas">
        <div className="container-content">
          <div className="scroll-animate mb-10 max-w-[56ch]">
            <p className="eyebrow">PRICING</p>
            <h2 className="display text-h2 mt-4 text-ink">Credits, not a subscription.</h2>
            <p className="text-lead mt-6 text-muted">Buy a block, spend as you go.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <article
                key={plan.name}
                className={`panel scroll-animate scroll-stagger-${
                  i + 1
                } flex flex-col overflow-hidden ${
                  plan.marked ? "border-azure-line" : "panel--hover"
                }`}
              >
                {/* Tier identity + price read as a panel header bar, not as
                    stacked editorial lines. The min-height is what keeps the
                    three headers identical: .chip inherits body's 1.5 line-height
                    and so stands 26.5px against the bare h3's 20.8px, which made
                    Pro's header 5.7px taller than its neighbours'. The grid
                    stretches all three panels to the tallest, and that surplus
                    landed in the CTA spacer below — a visibly larger gap in the
                    two unmarked tiers. Fix the header, not the spacer. */}
                <div className="panel__header min-h-[52px]">
                  <span className="flex min-w-0 items-center gap-4">
                    {/* The chip's own azure-dim fill on panel-2 composites to
                        4.16:1 behind 11px mono — under the AA floor. Bare panel-2
                        measures 5.07:1, so the fill goes and the azure border and
                        text carry the mark. */}
                    {plan.marked ? (
                      <span className="chip chip--action bg-transparent">MOST CHOSEN</span>
                    ) : null}
                    <h3 className="display text-h3 normal-case text-ink">{plan.name}</h3>
                  </span>
                  <p className="tabular text-h3 font-semibold leading-[1.04] tracking-[var(--track-h2)] text-ink">
                    {plan.price}
                  </p>
                </div>

                <div className="panel__body flex flex-1 flex-col">
                  <p className="text-body-sm text-muted">{plan.note}</p>
                  <p className="eyebrow tabular mt-2 text-dim">{plan.credits}</p>

                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-body flex gap-2 text-muted">
                        <span className="font-mono text-dim" aria-hidden="true">
                          ·
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* One marker per tier, not three. The border and the chip
                      already say which tier is chosen; a solid azure fill on top
                      of them is the loudest mark in the section and stops the
                      emphasis reading as emphasis. All three CTAs match. */}
                  <div className="mt-6 flex flex-1 items-end">
                    <Link href="/auth/register" className="cta cta--secondary w-full justify-center">
                      Start free
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="panel mt-6 grid overflow-hidden md:grid-cols-3">
            {LEDGER.map((entry, i) => (
              <p
                key={entry}
                className={`font-mono tabular text-eyebrow tracking-[0.08em] px-6 py-4 uppercase ${
                  LEDGER_HUE[i]
                } ${i > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""}`}
              >
                {entry}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — QUOTES ------------------------------------------------------ */}
      {/* Hue: mint on the outcome fragment of each attribution — the only part
          of the line that reports a result. */}
      <section className="section section--tight band bg-surface">
        <div className="container-content">
          {/* Eyebrow + h2, the same two parts FAQ carries. No lead: the page is
              already over its reading-copy budget, and a label is not prose. */}
          <div className="scroll-animate mb-10">
            <p className="eyebrow">TESTIMONIALS</p>
            <h2 className="display text-h2 mt-4 text-ink">What people told us.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {QUOTES.map((item, i) => {
              /* Split at the final separator: everything after it is the outcome. */
              const outcomeAt = item.attribution.lastIndexOf(" · ") + 3;
              return (
                <figure
                  key={item.attribution}
                  className={`panel scroll-animate scroll-stagger-${
                    i + 1
                  } flex flex-col overflow-hidden`}
                >
                  <div className="panel__body flex-1">
                    <blockquote className="text-lead text-ink">{item.quote}</blockquote>
                  </div>
                  {/* A real full-bleed footer bar on a panel body, rather than a
                      padded box clawing its own padding back with negative
                      margins. Mint already lives in this line, so the status dot
                      costs no hue and gives the card its control-room tell. */}
                  <figcaption className="eyebrow border-t border-line bg-panel-2 px-6 py-4 text-dim">
                    {item.attribution.slice(0, outcomeAt)}
                    <span className="status text-mint">
                      <span className="status__dot" aria-hidden="true" />
                      {item.attribution.slice(outcomeAt)}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 — FAQ --------------------------------------------------------- */}
      {/* Hue: azure on the open marker — the control you just acted on. */}
      <section id="faq" className="section bg-canvas">
        <div className="container-prose">
          <div className="scroll-animate mb-10">
            <p className="eyebrow">FAQ</p>
            <h2 className="display text-h2 mt-4 text-ink">Questions we get.</h2>
          </div>

          <div className="scroll-animate scroll-stagger-1">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <hr className="rule" />
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="text-lead text-ink">{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-lead shrink-0 leading-none text-dim group-open:text-azure"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="text-body mt-4 max-w-[64ch] text-muted">{faq.answer}</p>
                </details>
              </div>
            ))}
            <hr className="rule" />
          </div>

          <p className="eyebrow mt-10">ANYTHING ELSE</p>
          <a href="mailto:support@lynceus.com" className="cta cta--ghost mt-2">
            support@lynceus.com
          </a>
        </div>
      </section>

      {/* 11 — CLOSING CTA ------------------------------------------------- */}
      {/* Hue: azure on the primary CTA only. The footer supplies the closing
          rule, so this band carries a top rule alone. Tight padding, not the
          full --section-pad: four short lines is ~197px of content, and 200px
          of air around it made the band half empty against a page that runs
          0.35–0.44 padding-to-content everywhere else. */}
      <section className="section section--tight border-t border-line bg-surface">
        <div className="container-narrow text-center">
          <h2 className="display text-h2 scroll-animate text-muted">
            Your next role is <span className="text-ink">already</span> posted.
          </h2>
          <p className="text-lead scroll-animate scroll-stagger-1 mx-auto mt-6 max-w-[52ch] text-muted">
            No card, no call.
          </p>
          <div className="scroll-animate scroll-stagger-2 mt-6">
            <Link href="/auth/register" className="cta cta--primary">
              Start free
              <span className="font-mono" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <p className="postscript mt-6">FIRST 10 CREDITS ARE ON US</p>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
