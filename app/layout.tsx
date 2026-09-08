import type { Metadata } from "next";
import { Inter, Reenie_Beanie } from "next/font/google";
import "./globals.css";

// next/font downloads these at build time and self-hosts them.
// No request to Google when someone visits — faster, and no tracking.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const reenie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-reenie",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ritika Chatterjee — Data Scientist & AI Engineer",
  description:
    "MS Data Science at Columbia. I build agentic AI systems, retrieval pipelines, and the data infrastructure underneath them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${reenie.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
