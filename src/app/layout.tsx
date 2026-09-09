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

const description =
  "Abdulfatai Jamiu is a Product/UI/UX Designer specialising in fintech, SaaS, AI and complex digital products. He designs clearer, more trustworthy experiences from research through delivery.";

export const metadata: Metadata = {
  // Required for absolute OG/Twitter image URLs — without it, link previews
  // resolve the image against a relative path and silently show nothing.
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Product Designer for Fintech, SaaS and AI Products`,
    template: `%s | ${site.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — Product Designer for Fintech, SaaS and AI Products`,
    description,
    type: "website",
    url: site.url,
    siteName: site.name,
    locale: "en_GB",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Product Designer for Fintech, SaaS and AI Products`,
    description,
    images: ["/og.jpg"],
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
        <script
          type="application/ld+json"
          // Person schema: name, role, location and the profiles a recruiter
          // would otherwise have to hunt for.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              url: site.url,
              jobTitle: "Product Designer",
              description,
              email: `mailto:${site.email}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Brighton",
                addressCountry: "GB",
              },
              knowsAbout: [
                "Product Design",
                "UX Design",
                "UI Design",
                "Fintech",
                "SaaS",
                "AI Products",
                "Design Systems",
                "User Research",
              ],
              sameAs: [site.linkedin, site.behance],
            }),
          }}
        />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
