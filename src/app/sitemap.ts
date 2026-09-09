import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/credentials`, lastModified: now, priority: 0.7 },
    { url: `${site.url}/brand`, lastModified: now, priority: 0.6 },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: now,
      priority: p.featured ? 0.9 : 0.7,
    })),
  ];
}
