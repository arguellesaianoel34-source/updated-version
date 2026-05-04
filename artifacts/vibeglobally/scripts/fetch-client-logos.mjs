#!/usr/bin/env node
/**
 * Downloads client logos from logo.clearbit.com into
 *   src/assets/images/clients/<slug>.png
 *
 * Edit the CLIENTS list below to add/remove sites or change slugs.
 * Run with:  node scripts/fetch-client-logos.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "src", "assets", "images", "clients");

// slug -> domain. Slug is the local filename (no extension).
const CLIENTS = [
  ["gaywellness", "gaywellness.com"],
  ["listglobally", "listglobally.com"],
  ["bcmedia", "bcmedia.tv"],
  ["allstate", "allstate.com"],
  ["velsoft", "velsoft.com"],
  ["familyfirstlife", "familyfirstlife.com"],
  ["spacer", "spacer.com.au"],
  ["simplywealth", "simplywealthgroup.com.au"],
  ["indoormedia", "indoormedia.com"],
];

async function fetchLogo(slug, domain) {
  const url = `https://logo.clearbit.com/${domain}`;
  const resp = await fetch(url, { redirect: "follow" });
  if (!resp.ok) {
    return { slug, ok: false, status: resp.status };
  }
  const buf = Buffer.from(await resp.arrayBuffer());
  await writeFile(join(OUT_DIR, `${slug}.png`), buf);
  return { slug, ok: true, bytes: buf.length };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Saving logos to: ${OUT_DIR}`);
  const results = await Promise.all(
    CLIENTS.map(([slug, domain]) =>
      fetchLogo(slug, domain).catch((err) => ({ slug, ok: false, error: err.message })),
    ),
  );
  let okCount = 0;
  for (const r of results) {
    if (r.ok) {
      okCount++;
      console.log(`  ok    ${r.slug.padEnd(20)} ${r.bytes} bytes`);
    } else {
      const reason = r.status ? `HTTP ${r.status}` : r.error ?? "unknown";
      console.log(`  FAIL  ${r.slug.padEnd(20)} ${reason}`);
    }
  }
  console.log(`\n${okCount}/${results.length} logos downloaded.`);
  if (okCount < results.length) process.exitCode = 1;
}

main();
