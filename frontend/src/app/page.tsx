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
  { label: "Time spent searching", manual: "Hours a day", jobsgpt: "Minutes a day" },
  { label: "Recruiter contacts", manual: "Manual research", jobsgpt: "In the record" },
  { label: "Outreach", manual: "Generic template", jobsgpt: "Drafted per role" },
  { label: "Company context", manual: "Whatever is public", jobsgpt: "Leadership and hiring team" },
  { label: "Tracking", manual: "A spreadsheet", jobsgpt: "Built in" },
  { label: "Ranking", manual: "Post date", jobsgpt: "Resume-scored" },
];

const PLANS = [
  {
    name: "Starter",
    note: "Enough to see whether it works for you.",
    price: "$9",
    credits: "50 CREDITS",
    marked: false,
    features: [
      "50 job searches",
      "25 drafted emails",
      "16 company reports",
      "Credits do not expire",
    ],
  },
  {
    name: "Pro",
    note: "For a search you are actually running.",
    price: "$29",
    credits: "240 CREDITS · 40 OF THEM FREE",
    marked: true,
    features: [
      "240 credits on a $29 pack",
      "120 drafted emails",
      "80 company reports",
      "Replies land in your own inbox",
    ],
  },
  {
    name: "Enterprise",
    note: "For teams and long horizons.",
    price: "$79",
    credits: "780 CREDITS · 180 OF THEM FREE",
    marked: false,
    features: [
      "780 credits on a $79 pack",
      "390 drafted emails",
      "260 company reports",
      "API access",
    ],
  },
];

const LEDGER = ["JOB SEARCH · 1 CREDIT", "AI EMAIL · 2 CREDITS", "COMPANY INTEL · 3 CREDITS"];

const QUOTES = [
  {
    quote:
      "Two weeks in I had three interviews booked, and I had not opened a job board once.",
    attribution: "SARAH M. · BACKEND ENGINEER · HIRED IN 6 WEEKS",
  },
  {
    quote:
      "It handles the part I kept putting off. I read the queue over coffee and send two emails.",
    attribution: "JAMES C. · PRODUCT DESIGNER · HIRED IN 9 WEEKS",
  },
  {
    quote:
      "I was changing fields. It read the transferable half of my resume better than I could explain it.",
    attribution: "EMILY P. · CAREER CHANGER · HIRED IN 11 WEEKS",
  },
];

const FAQS = [
  {
    question: "How do credits work?",
    answer:
      "You buy a pack and spend it per action: one credit for a search, two for a drafted email, three for a company report. Nothing renews on its own, and nothing expires.",
  },
  {
    question: "What do you tell me about a job?",
    answer:
      "The posting itself, who posted it, who owns the hiring decision, and direct contact details for the recruiter and the hiring manager. Where the data exists, leadership contacts as well.",
  },
  {
    question: "How does the email drafting work?",
    answer:
      "We read the posting, the company and your resume, then write a first draft that points at the overlap. You edit it in the browser and send it yourself.",
  },
  {
    question: "Can I get a refund on unused credits?",
    answer:
      "Within the first 14 days, yes, on anything you have not spent. After that credits are non-refundable, but they stay on the account for as long as you keep it.",
  },
  {
    question: "How good is the matching?",
    answer:
      "Every opening is scored against your resume and the bar you set, and you see that score before you spend a credit on it. When a match reads wrong, say so and the ranking adjusts.",
  },
  {
    question: "Do credits expire?",
    answer:
      "No. They sit on the account until you use them, whether that is next week or next year.",
  },
  {
    question: "Where do the contact details come from?",
    answer:
      "Public sources, professional networks and our own database. Records are re-verified on a schedule, so you are not emailing someone who left two years ago.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your resume and account data are encrypted in transit and at rest. We do not sell it, and we do not hand it to an employer unless you ask us to.",
  },
];

/* ---------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <HomeNavbar />

      {/* 01 — HERO -------------------------------------------------------- */}
      <header id="home" className="section section--tight bg-paper pt-[var(--hero-pad-top)]">
        <div className="container-content">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-30">
            {/* Left — copy */}
            <div className="scroll-animate">
              <p className="eyebrow">AUTOMATED JOB SEARCH</p>

              <h1 className="display text-h1 mt-6 text-ink">
                We run the search.
                <br />
                You take the <span className="editorial-accent">interview</span>.
              </h1>

              <p className="text-lead mt-6 max-w-[52ch] text-muted">
                JobsGPT watches every board, scores each opening against your resume, finds the
                person actually doing the hiring, and drafts the email. You review it and hit send.
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

              <p className="postscript mt-10">
                NO SUBSCRIPTION · CREDITS DON&apos;T EXPIRE · NOBODY WILL EVER ASK YOU TO BOOK A
                DEMO
              </p>
            </div>

            {/* Right — match queue panel (flat hairline, no chrome) */}
            <div className="scroll-animate scroll-stagger-2">
              <div className="hairline-box bg-paper">
                <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                  <p className="eyebrow">MATCH QUEUE</p>
                  <p className="eyebrow flex items-center gap-2">
                    <span className="queue-pulse block h-2 w-2 bg-accent" aria-hidden="true" />
                    LIVE
                  </p>
                </div>

                <div className="relative overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="scan-sweep pointer-events-none absolute inset-x-0 top-0 h-1/4 border-t border-ink/20"
                  />

                  <div className="eyebrow grid grid-cols-[1fr_auto_auto] gap-6 border-b border-hairline px-6 py-4">
                    <span>ROLE</span>
                    <span>COMPANY</span>
                    <span className="text-right">MATCH</span>
                  </div>

                  {QUEUE_ROWS.map((row, i) => (
                    <div
                      key={row.role}
                      className={`grid grid-cols-[1fr_auto_auto] items-baseline gap-6 px-6 py-6 ${
                        i < QUEUE_ROWS.length - 1 ? "border-b border-hairline" : ""
                      }`}
                    >
                      <span className="text-body-sm text-ink">{row.role}</span>
                      <span className="text-body-sm text-muted">{row.company}</span>
                      <span
                        className={`font-mono text-body-sm text-right ${
                          i === 0 ? "text-accent" : "text-muted"
                        }`}
                      >
                        {row.match}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="eyebrow border-t border-hairline px-6 py-4">
                  RESCANNED CONTINUOUSLY · YOU REVIEW BEFORE ANYTHING SENDS
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — BOARD STRIP ------------------------------------------------- */}
      <section className="section section--tight border-y border-hairline bg-paper">
        <div className="container-content">
          <p className="eyebrow">CONTINUOUSLY SCANNING</p>
        </div>
        <div className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee className="[--duration:40s] [--gap:40px]">
            {BOARDS.map((board) => (
              <span key={board} className="eyebrow text-body-sm shrink-0 text-muted">
                {board}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* 03 — MANIFESTO INTERRUPT ----------------------------------------- */}
      <section className="section section--loose bg-paper-alt">
        <div className="container-narrow">
          <p className="postscript text-h3 scroll-animate text-center text-muted">
            THE AVERAGE SEARCH TAKES FIVE MONTHS. MOST OF THAT IS TABS.
          </p>
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
      <section className="section bg-paper">
        <div className="container-narrow">
          <div className="scroll-animate mb-10 max-w-[56ch]">
            <h2 className="display text-h2 text-ink">
              Two ways to run the <span className="editorial-accent">same</span> search.
            </h2>
            <p className="text-lead mt-6 text-muted">The difference is who does the reading.</p>
          </div>

          <div className="scroll-animate scroll-stagger-1 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="eyebrow py-4 pr-6">
                    <span className="sr-only">Capability</span>
                  </th>
                  <th scope="col" className="eyebrow py-4 pr-6">
                    DOING IT YOURSELF
                  </th>
                  <th scope="col" className="eyebrow py-4">
                    WITH JOBSGPT
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-hairline">
                    <th
                      scope="row"
                      className="text-body py-6 pr-6 align-top font-medium text-ink"
                    >
                      {row.label}
                    </th>
                    <td className="text-body py-6 pr-6 align-top text-muted">
                      <span className="font-mono mr-2 text-muted" aria-hidden="true">
                        —
                      </span>
                      {row.manual}
                    </td>
                    <td className="text-body py-6 align-top text-ink">{row.jobsgpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 07 — NUMBERS BAND ------------------------------------------------ */}
      <section className="section section--tight bg-canvas text-canvas-ink">
        <div className="container-content">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="px-6">
              <p className="display text-h2 text-canvas-ink">
                <AnimatedCounter end={10000} suffix="+" />
              </p>
              <p className="eyebrow mt-4 text-canvas-ink/60">JOBS MATCHED</p>
            </div>
            <div className="border-l border-canvas-ink/15 px-6">
              <p className="display text-h2 text-canvas-ink">
                <AnimatedCounter end={500} suffix="+" />
              </p>
              <p className="eyebrow mt-4 text-canvas-ink/60">COMPANIES COVERED</p>
            </div>
            <div className="mt-10 px-6 md:mt-0 md:border-l md:border-canvas-ink/15">
              <p className="display text-h2 text-canvas-ink">
                <AnimatedCounter end={95} suffix="%" />
              </p>
              <p className="eyebrow mt-4 text-canvas-ink/60">MATCH SATISFACTION</p>
            </div>
            <div className="mt-10 border-l border-canvas-ink/15 px-6 md:mt-0">
              <p className="display text-h2 text-canvas-ink">24/7</p>
              <p className="eyebrow mt-4 text-canvas-ink/60">ALWAYS SCANNING</p>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — PRICING ----------------------------------------------------- */}
      <section id="pricing" className="section bg-paper">
        <div className="container-content">
          <div className="scroll-animate mb-10 max-w-[56ch]">
            <p className="eyebrow">PRICING</p>
            <h2 className="display text-h2 mt-4 text-ink">Credits, not a subscription.</h2>
            <p className="text-lead mt-6 text-muted">
              Buy what you need. What you do not spend stays on the account.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <article
                key={plan.name}
                className={`hairline-box hairline-box--hover scroll-animate scroll-stagger-${
                  i + 1
                } flex flex-col p-10 ${plan.marked ? "border-ink" : ""}`}
              >
                {plan.marked ? <p className="eyebrow mb-2">MOST CHOSEN</p> : null}

                <h3 className="display text-h3 text-ink">{plan.name}</h3>
                <p className="text-body-sm mt-2 text-muted">{plan.note}</p>

                <p className="display text-h2 mt-6 text-ink">{plan.price}</p>
                <p className="eyebrow mt-2">{plan.credits}</p>

                <ul className="mt-6 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-body flex gap-2 text-muted">
                      <span className="font-mono text-muted" aria-hidden="true">
                        ·
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-1 items-end">
                  <Link
                    href="/auth/register"
                    className={`cta w-full justify-center ${
                      plan.marked ? "cta--primary" : "cta--secondary"
                    }`}
                  >
                    Start free
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="hairline-box mt-10 grid md:grid-cols-3">
            {LEDGER.map((entry, i) => (
              <p
                key={entry}
                className={`eyebrow px-6 py-6 ${
                  i > 0 ? "border-t border-hairline md:border-t-0 md:border-l" : ""
                }`}
              >
                {entry}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — QUOTES ------------------------------------------------------ */}
      <section className="section bg-paper-alt">
        <div className="container-content">
          <div className="scroll-animate mb-10 max-w-[56ch]">
            <h2 className="display text-h2 text-ink">What people told us.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {QUOTES.map((item, i) => (
              <figure
                key={item.attribution}
                className={`hairline-box scroll-animate scroll-stagger-${
                  i + 1
                } flex flex-col p-10`}
              >
                <blockquote className="text-lead text-ink">{item.quote}</blockquote>
                <figcaption className="eyebrow mt-10">{item.attribution}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — FAQ --------------------------------------------------------- */}
      <section id="faq" className="section bg-paper">
        <div className="container-prose">
          <div className="scroll-animate mb-10">
            <h2 className="display text-h2 text-ink">Questions we get.</h2>
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
                      className="font-mono text-lead shrink-0 leading-none text-muted"
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
          <a href="mailto:support@jobsgpt.com" className="cta cta--ghost mt-2">
            support@jobsgpt.com
          </a>
        </div>
      </section>

      {/* 11 — CLOSING CTA ------------------------------------------------- */}
      <section className="section section--loose bg-canvas text-canvas-ink">
        <div className="container-narrow text-center">
          <h2 className="display text-h2 scroll-animate text-canvas-ink">
            Your next role is <span className="editorial-accent">already</span> posted.
          </h2>
          <p className="text-lead scroll-animate scroll-stagger-1 mx-auto mt-6 max-w-[52ch] text-canvas-ink/70">
            It went up while you were doing something else, and you have not seen it yet.
          </p>
          <div className="scroll-animate scroll-stagger-2 mt-10">
            <Link href="/auth/register" className="cta cta--inverse">
              Start free
              <span className="font-mono" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <p className="postscript mt-10 text-canvas-ink/60">FIRST 10 CREDITS ARE ON US</p>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
