import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

/* Display — bespoke-per-project face (P2). Variable `opsz` keeps the
   64px hero from reading like scaled-up body copy. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

/* Body — off-the-shelf (P3: spend on display, default on body). */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Mono — eyebrows, labels, data columns. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* Serif italic from a separate family — the marked word inside the
   headline (P8, italic-accent Strategy A). */
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobsGPT — we run the search, you take the interview",
  description:
    "JobsGPT scans every job board continuously, scores each opening against your resume, finds the person actually doing the hiring, and drafts the outreach. You review and send.",
  openGraph: {
    title: "JobsGPT — we run the search, you take the interview",
    description:
      "Continuous board scanning, resume-scored matching, and drafted outreach. Credits, not subscriptions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${inter.variable} ${plexMono.variable} ${instrument.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
