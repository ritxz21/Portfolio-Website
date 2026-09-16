import type { Metadata } from "next";
import { Inter, Reenie_Beanie } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
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
  // metadataBase turns relative URLs (like the generated OG image) into
  // absolute ones. Link previews break without it.
  metadataBase: new URL(site.url),

  title: {
    default: `${site.name} — ${site.role}`,
    // Every other page renders as "Page title · Ritika Chatterjee"
    template: `%s · ${site.name}`,
  },
  description: site.tagline,

  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: site.url,
  },

  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },

  alternates: { canonical: "/" },
};

// Runs before the page paints, so someone who picked light mode doesn't
// get a flash of dark first. It has to be a raw string: this must execute
// before React hydrates.
const themeScript = `
document.documentElement.classList.add('js');
try {
  var saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.dataset.theme = 'light';
  }
} catch (e) {}
`;

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
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
