"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectArt } from "./ProjectArt";
import covers from "@/data/covers.json";

type Props = {
  project: Project;
  /** Larger padding + frame detail for hero placements. */
  size?: "card" | "hero";
  priority?: boolean;
};

/**
 * Art-directed cover. Real Behance imagery is presented inside a mockup shell
 * — browser chrome for web products, a device frame for mobile — sitting on a
 * tinted ground drawn from the project's own art direction. Projects without a
 * cover image fall back to the generated SVG composition.
 *
 * Images are loaded straight from Behance's CDN by the browser (no server-side
 * optimisation), so nothing breaks if that host rejects proxied requests.
 */
export function ProjectCover({ project, size = "card", priority }: Props) {
  // If the remote cover fails to load (host down, hotlink blocked, URL rotated),
  // fall back to the generated artwork rather than showing an empty frame.
  const [failed, setFailed] = useState(false);

  // A locally downloaded copy (via `npm run covers`) always wins over the
  // remote Behance URL.
  const src =
    (covers as Record<string, string>)[project.slug] ?? project.cover;

  if (!src || failed) {
    return <ProjectArt project={project} />;
  }

  const { hue, accent } = project.art;
  const isPhone = project.frame === "phone";
  const pad = size === "hero" ? "p-6 md:p-14" : "p-4 md:p-8";

  /**
   * Shared image wiring. The ref check matters: the browser can attempt (and
   * fail) the request before React hydrates, so the onError event is missed
   * entirely. Re-checking `complete && naturalWidth === 0` on mount catches
   * that case and still hands over to the generated artwork.
   */
  const imgProps = {
    src,
    alt: `${project.title} — ${project.category}`,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    onError: () => setFailed(true),
    ref: (el: HTMLImageElement | null) => {
      if (el?.complete && el.naturalWidth === 0) setFailed(true);
    },
  };

  // "portrait" — a tall phone screen that already carries its own device bezel.
  // Contained and centred on the project's tinted ground so it is never cropped
  // or upscaled past its natural size.
  if (project.frame === "portrait") {
    return (
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden py-6"
        style={{
          backgroundImage: `radial-gradient(120% 100% at 78% 12%, ${accent}22, transparent 62%), linear-gradient(140deg, ${hue}, #05050C 78%)`,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...imgProps}
          alt={imgProps.alt}
          className="relative h-full w-auto max-w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,.7)]"
        />
        <span className="display pointer-events-none absolute bottom-3 left-4 text-xs tracking-[0.22em] text-white/45 md:bottom-5 md:left-7 md:text-sm">
          {project.title.toUpperCase()} — {project.year}
        </span>
      </div>
    );
  }

  // "flat" — the image is already a finished mockup with its own staging, so it
  // fills the frame edge to edge rather than sitting inside a second chrome.
  if (project.frame === "flat") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#05050C]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...imgProps}
          alt={imgProps.alt}
          className="h-full w-full object-cover"
        />
        <span className="display pointer-events-none absolute bottom-3 left-4 text-xs tracking-[0.22em] text-white/55 mix-blend-difference md:bottom-5 md:left-7 md:text-sm">
          {project.title.toUpperCase()} — {project.year}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${pad}`}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 78% 12%, ${accent}22, transparent 62%), linear-gradient(140deg, ${hue}, #05050C 78%)`,
      }}
    >
      {/* faint grid, matching the generated artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {isPhone ? (
        <div className="relative h-full w-auto max-w-full">
          <div className="relative flex h-full items-center justify-center">
            <div className="relative h-full overflow-hidden rounded-[8%/4%] border border-white/15 bg-[#0b0b14] p-[0.8%] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...imgProps}
          alt={imgProps.alt}
                className="h-full w-auto rounded-[7%/3.4%] object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <figure className="relative w-full overflow-hidden rounded-md border border-white/15 bg-[#0b0b14] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
          {/* browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
            </span>
            <span
              aria-hidden="true"
              className="ml-2 hidden h-3 flex-1 rounded-full bg-white/[0.07] sm:block"
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...imgProps}
          alt={imgProps.alt}
            className="block w-full object-cover"
            style={{ aspectRatio: size === "hero" ? "16 / 9" : "16 / 10" }}
          />
        </figure>
      )}

      <span className="display pointer-events-none absolute bottom-3 left-4 text-xs tracking-[0.22em] text-white/45 md:bottom-5 md:left-7 md:text-sm">
        {project.title.toUpperCase()} — {project.year}
      </span>
    </div>
  );
}
