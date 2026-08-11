import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

/* Two faces, one family. The control-room register wants a technical
   grotesque and its matching mono — labels, counters, timestamps and
   column headers all sit in the mono, so they must share a skeleton. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lynceus — we run the search, you take the interview",
  description:
    "Lynceus scans every job board continuously, scores each opening against your resume, finds the person actually doing the hiring, and drafts the outreach. You review and send.",
  openGraph: {
    title: "Lynceus — we run the search, you take the interview",
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
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
