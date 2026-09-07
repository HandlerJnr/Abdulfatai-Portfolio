#!/usr/bin/env node
/**
 * Download every remote project cover into public/projects/ and write a
 * manifest the site prefers over the remote URL.
 *
 *   npm run covers
 *
 * Run this once on a machine with normal internet access. After it succeeds,
 * the site serves its own copies of the images: faster, cached properly, and
 * immune to Behance rotating a URL or blocking hotlinks. Commit both
 * public/projects/ and src/data/covers.json.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/projects");
const manifestPath = resolve(root, "src/data/covers.json");

const { projects } = await import(
  resolve(root, "src/data/projects.ts").replace(/\\/g, "/")
).catch(async () => {
  // projects.ts is TypeScript; read the cover URLs out of it directly instead.
  const { readFile } = await import("node:fs/promises");
  const src = await readFile(resolve(root, "src/data/projects.ts"), "utf8");
  const out = [];
  const re =
    /slug:\s*"([^"]+)"[\s\S]*?(?:cover:\s*\n?\s*"([^"]+)")?(?=\n  \{|\n\];)/g;
  let m;
  while ((m = re.exec(src))) if (m[2]) out.push({ slug: m[1], cover: m[2] });
  return { projects: out };
});

const targets = projects.filter((p) => p.cover);
if (!targets.length) {
  console.log("No remote covers found — nothing to do.");
  process.exit(0);
}

await mkdir(outDir, { recursive: true });
const manifest = {};
let failures = 0;

for (const { slug, cover } of targets) {
  try {
    const res = await fetch(cover, {
      headers: { "user-agent": "Mozilla/5.0", referer: "https://www.behance.net/" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const type = res.headers.get("content-type") ?? "";
    const ext = type.includes("png")
      ? "png"
      : type.includes("webp")
        ? "webp"
        : "jpg";
    const file = `${slug}.${ext}`;
    await writeFile(
      resolve(outDir, file),
      Buffer.from(await res.arrayBuffer()),
    );
    manifest[slug] = `/projects/${file}`;
    console.log(`  ✓ ${slug} → public/projects/${file}`);
  } catch (err) {
    failures++;
    console.warn(`  ✗ ${slug}: ${err.message} (keeping the remote URL)`);
  }
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `\nWrote ${Object.keys(manifest).length}/${targets.length} covers to src/data/covers.json.` +
    (failures ? ` ${failures} failed and will keep loading from Behance.` : ""),
);
