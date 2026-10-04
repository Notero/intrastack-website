#!/usr/bin/env node
// Run a Lighthouse audit (performance, accessibility, best-practices, SEO)
// against a running server and print a score summary.
// Usage: BASE_URL=http://localhost:3000 node scripts/audit-lighthouse.mjs            (every page in sitemap.xml)
//        BASE_URL=http://localhost:3000 node scripts/audit-lighthouse.mjs /about /contact  (only these paths)
//        LIGHTHOUSE_MIN_SCORE=90 node scripts/audit-lighthouse.mjs   (fail build below this score)

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const MIN_SCORE = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? 90);
const OUT_DIR = path.join("scripts", "lighthouse-reports");

// ponytail: sitemap.xml already lists every route (static + dynamic); reuse it instead of re-deriving routes from content modules.
async function pagesFromSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`failed to fetch ${BASE}/sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap.xml contained no <loc> entries");
  return urls.map((u) => new URL(u).pathname);
}

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

function scoreOf(lhr, category) {
  return Math.round((lhr.categories[category]?.score ?? 0) * 100);
}

async function runAudit(url) {
  const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: ["html", "json"],
      onlyCategories: CATEGORIES,
      logLevel: "error",
    });

    if (!result) throw new Error("lighthouse produced no result");
    return result;
  } finally {
    await chrome.kill();
  }
}

async function saveReports(result, slug) {
  await mkdir(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = path.join(OUT_DIR, `${slug}-${stamp}`);

  const [html, json] = result.report;
  await writeFile(`${base}.html`, html);
  await writeFile(`${base}.json`, json);

  return { htmlPath: `${base}.html`, jsonPath: `${base}.json` };
}

(async () => {
  const argPaths = process.argv.slice(2);
  const paths = argPaths.length > 0 ? argPaths : await pagesFromSitemap();

  console.log(`auditing ${paths.length} page(s) on ${BASE} (threshold: ${MIN_SCORE})`);

  let totalFailures = 0;
  const rows = [];

  for (const p of paths) {
    const url = `${BASE}${p}`;
    let result;
    try {
      result = await runAudit(url);
    } catch (err) {
      console.error(`✗ [${p}] lighthouse run failed:`, err.message);
      totalFailures++;
      continue;
    }

    const { lhr } = result;
    const slug = (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "_")) || "home";
    const { htmlPath, jsonPath } = await saveReports(result, slug);

    console.log(`\n[${lhr.finalDisplayedUrl ?? url}]`);
    let pageFailures = 0;
    const scores = {};
    for (const category of CATEGORIES) {
      const score = scoreOf(lhr, category);
      scores[category] = score;
      const mark = score >= MIN_SCORE ? "✓" : "✗";
      if (score < MIN_SCORE) pageFailures++;
      console.log(`  ${mark} ${category}: ${score}`);
    }
    console.log(`  reports: ${htmlPath} | ${jsonPath}`);

    totalFailures += pageFailures;
    rows.push({ path: p, ...scores, failures: pageFailures });
  }

  console.log(`\n=== summary ===`);
  for (const row of rows) {
    const mark = row.failures === 0 ? "✓" : "✗";
    console.log(
      `  ${mark} ${row.path}  perf:${row.performance} a11y:${row.accessibility} bp:${row["best-practices"]} seo:${row.seo}`
    );
  }

  console.log(
    `\n${totalFailures === 0 ? "✓ all pages/categories passed threshold" : `✗ ${totalFailures} categor${totalFailures === 1 ? "y" : "ies"} below ${MIN_SCORE} across ${paths.length} page(s)`}`
  );
  process.exit(totalFailures === 0 ? 0 : 1);
})();
