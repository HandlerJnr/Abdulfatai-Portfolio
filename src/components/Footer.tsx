import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60 bg-ink px-5 py-8 md:px-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="display text-2xl" aria-label="Back to top">
          AJ<span className="text-accent">.</span>
        </Link>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="link-line eyebrow !text-white/80">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.behance} target="_blank" rel="noreferrer" className="link-line eyebrow !text-white/80">
              Behance
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="link-line eyebrow !text-white/80">
              Email
            </a>
          </li>
          <li>
            <Link href="/credentials" className="link-line eyebrow !text-white/80">
              Credentials
            </Link>
          </li>
          <li>
            <Link href="/brand" className="link-line eyebrow !text-white/80">
              Brand
            </Link>
          </li>
          <li>
            <a href={site.cv} download className="link-line eyebrow !text-white/80">
              Download CV
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-line/60 pt-6 text-[0.6875rem] uppercase tracking-[0.18em] text-white/40 md:flex-row md:justify-between">
        <span>© {year} {site.name}. All rights reserved.</span>
        <span>{site.location}</span>
      </div>
    </footer>
  );
}
