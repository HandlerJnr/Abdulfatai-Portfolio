import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";

// Self-hosted so the build never depends on a Google Fonts fetch.
const display = localFont({
  src: "../fonts/bebas-neue-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  fallback: ["Oswald", "Impact", "Haettenschweiler", "sans-serif"],
});

const body = localFont({
  src: "../fonts/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-body",
  display: "swap",
  fallback: ["Inter", "system-ui", "Helvetica Neue", "sans-serif"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.title}`,
  description:
    "UI/UX Product Designer and Researcher in Brighton, UK, creating clear, useful digital experiences for complex products across healthcare, fintech, SaaS, AI and booking platforms.",
  openGraph: {
    title: `${site.name} — ${site.title}`,
    description:
      "Product designer experienced in SaaS, fintech, AI, healthcare, booking platforms, design systems, user research and developer handoff.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05050C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-ink text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
