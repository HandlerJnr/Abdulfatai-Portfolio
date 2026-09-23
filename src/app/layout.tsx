import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const description =
  "Abdulfatai Jamiu is a Product Designer specialising in fintech, SaaS, AI and complex digital products. He designs clearer, more trustworthy experiences from research through delivery.";

export const metadata: Metadata = {
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
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
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
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
