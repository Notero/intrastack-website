#!/usr/bin/env node
// Verify schema.org JSON-LD + sitemap.xml + robots.txt against a running server.
// Usage: BASE_URL=http://localhost:3000 node scripts/verify-seo.mjs

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const PAGES = [
  { path: "/", required: ["Organization", "WebSite"] },
  { path: "/about", required: ["BreadcrumbList"] },
  { path: "/about/leadership", required: ["BreadcrumbList", "Person"] },
  { path: "/contact", required: ["BreadcrumbList", "LocalBusiness"] },
  { path: "/services", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/solutions", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/industries", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/services/cloud_migration", required: ["BreadcrumbList", "Service"] },
  { path: "/solutions/data_analytics", required: ["BreadcrumbList", "Service"] },
  { path: "/industries/finance", required: ["BreadcrumbList", "Service"] },
  { path: "/news/blogs", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/news/trends", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/news/whitepaper", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/news/client_stories", required: ["BreadcrumbList", "CollectionPage"] },
  { path: "/careers", required: ["BreadcrumbList"] },
];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error("  ✗", msg);
};
const ok = (msg) => console.log("  ✓", msg);

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const body = await res.text();
  return { status: res.status, body, contentType: res.headers.get("content-type") ?? "" };
}

function extractJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch (e) {
      out.push({ __parseError: e.message, __raw: raw.slice(0, 200) });
    }
  }
  return out;
}

async function checkPage({ path, required }) {
  console.log(`\n[${path}]`);
  const { status, body } = await get(path);
  if (status !== 200) {
    fail(`HTTP ${status}`);
    return;
  }
  ok(`HTTP 200`);
  const blocks = extractJsonLd(body);
  if (blocks.length === 0) {
    fail("no application/ld+json blocks");
    return;
  }
  const types = new Set();
  for (const b of blocks) {
    if (b.__parseError) {
      fail(`JSON-LD parse error: ${b.__parseError}`);
      continue;
    }
    if (!b["@context"]) fail(`missing @context on block: ${JSON.stringify(b).slice(0, 80)}`);
    if (!b["@type"]) fail(`missing @type on block: ${JSON.stringify(b).slice(0, 80)}`);
    types.add(b["@type"]);
  }
  ok(`${blocks.length} JSON-LD block(s), types: ${[...types].join(", ")}`);
  for (const t of required) {
    if (types.has(t)) ok(`has ${t}`);
    else fail(`missing required @type "${t}"`);
  }
}

async function checkSitemap() {
  console.log(`\n[/sitemap.xml]`);
  const { status, body, contentType } = await get("/sitemap.xml");
  if (status !== 200) return fail(`HTTP ${status}`);
  ok(`HTTP 200 (${contentType})`);
  if (!body.includes("<urlset")) return fail("not a valid urlset");
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(`${urls.length} <loc> entries`);
  const mustInclude = [
    "/services/cloud_migration",
    "/solutions/data_analytics",
    "/industries/finance",
    "/news/blogs",
    "/about/leadership",
    "/contact",
  ];
  for (const frag of mustInclude) {
    if (urls.some((u) => u.endsWith(frag))) ok(`contains ${frag}`);
    else fail(`sitemap missing ${frag}`);
  }
}

async function checkRobots() {
  console.log(`\n[/robots.txt]`);
  const { status, body } = await get("/robots.txt");
  if (status !== 200) return fail(`HTTP ${status}`);
  ok(`HTTP 200`);
  if (/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i.test(body)) ok("references sitemap.xml");
  else fail("does not reference sitemap.xml");
}

(async () => {
  console.log(`verifying against ${BASE}`);
  for (const p of PAGES) await checkPage(p);
  await checkSitemap();
  await checkRobots();
  console.log(
    `\n${failures === 0 ? "✓ all checks passed" : `✗ ${failures} failure(s)`}`
  );
  process.exit(failures === 0 ? 0 : 1);
})();
