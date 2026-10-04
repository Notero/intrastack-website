// Seed / re-seed news_items rows + images for UI testing.
//
// Goal: every news_kind enum value (blog | trend | whitepaper | client_story)
// has at least one row at each of the 1-, 2-, and 3-image gallery variants,
// so the list and detail templates can be exercised end to end.
//
// Idempotent: rows are inserted only if the slug doesn't already exist;
// image uploads use upsert. Re-running is safe.
//
// Convention (from migration 0004_news_item_images.sql):
//   <row_id>/cover.jpg
//   <row_id>/image-2.webp
//   <row_id>/image-3.webp
// Bytes are served with Content-Type image/webp regardless of extension.
//
// Run: node --env-file=.env.local scripts/seed-news-extra-images.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");

const sb = createClient(url, key);
const BUCKET = "news-images";
const IMG_DIR = path.resolve("public/images/unsplash");

// --- Image pool ------------------------------------------------------------
// Grab every -1200.webp / -1600.webp from public/images/unsplash and shuffle
// deterministically. A row's images come from `pick(n)`, which round-robins
// through the pool so we don't run out and we get random-looking variety.
const allFiles = (await readdir(IMG_DIR)).filter((f) => /-(1200|1600)\.webp$/.test(f));
// Deterministic shuffle (mulberry32 with a fixed seed) so re-runs are stable.
function shuffle(arr, seed = 0x9e3779b9) {
  const a = arr.slice();
  let t = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    const j = ((r ^ (r >>> 14)) >>> 0) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pool = shuffle(allFiles);
let cursor = 0;
const pick = (n) => Array.from({ length: n }, () => pool[cursor++ % pool.length]);

// --- Rows to ensure exist --------------------------------------------------
// `images` = total image count for the row (1, 2, or 3). The driver code
// translates that into cover + optional image_2 + optional image_3.
const seedPlan = [
  // BLOGS — three already exist with 1/2/3; add one more 3-image to round out.
  { slug: "michael-levitre-vp-sales", kind: "blog", images: 1, fields: {
    title: "Michael Levitre appointed Vice President of Sales",
    excerpt: "We are thrilled to announce that Michael Levitre has joined Intrastack Solutions as our new Vice President of Sales.",
    tag: "Team", published_at: "2024-07-11", author: "Intrastack",
  }},
  { slug: "bengaluru-delivery-center", kind: "blog", images: 2, fields: {
    title: "Intrastack expands with Bengaluru, India delivery center",
    excerpt: "Intrastack Solutions is excited to announce the establishment of our new delivery center in Bengaluru, India — extending round-the-clock coverage across our delivery footprint.",
    tag: "Network", published_at: "2024-08-09",
  }},
  { slug: "tokyo-delivery-center", kind: "blog", images: 3, fields: {
    title: "Intrastack Solutions establishes Tokyo, Japan delivery center",
    excerpt: "A strategic expansion that puts senior engineers within client time zones across APAC.",
    tag: "Network", published_at: "2024-08-09",
  }},
  { slug: "kubernetes-operator-pattern-lessons", kind: "blog", images: 2, fields: {
    title: "Three years of operators: lessons from running 40+ in production",
    excerpt: "Operator-pattern controllers are the right abstraction — until they aren't. A retrospective on where they earned their keep and where they bit us.",
    tag: "Platform", published_at: "2025-02-14", author: "Intrastack Platform",
  }},

  // TRENDS — already have 1 with 2 images; add 1- and 3-image variants.
  { slug: "edge-ai-inference-trend", kind: "trend", images: 2, fields: {
    title: "Edge AI inference is reshaping the data-center perimeter",
    excerpt: "Specialist accelerators and tighter latency budgets are pushing inference workloads out of the core and into the network edge.",
    tag: "AI Infrastructure", published_at: "2025-09-12", read_time: "6 min", author: "Intrastack Research",
  }},
  { slug: "sustainable-data-center-cooling-trend", kind: "trend", images: 1, fields: {
    title: "Liquid cooling is no longer the exotic option",
    excerpt: "Direct-to-chip and immersion cooling are crossing into mainstream procurement decks as rack densities climb past 50 kW.",
    tag: "Sustainability", published_at: "2025-10-03", read_time: "4 min", author: "Intrastack Research",
  }},
  { slug: "post-quantum-cryptography-migration-trend", kind: "trend", images: 3, fields: {
    title: "Post-quantum cryptography migration enters the planning phase",
    excerpt: "NIST's finalised algorithms turn PQC from a research topic into a multi-year program of inventory, crypto-agility, and key rotation.",
    tag: "Security", published_at: "2025-11-18", read_time: "8 min", author: "Intrastack Security",
  }},

  // WHITEPAPERS — already have 1 with 2 images; add 1- and 3-image variants.
  { slug: "hybrid-cloud-cost-optimization-whitepaper", kind: "whitepaper", images: 2, fields: {
    title: "A practitioner's guide to hybrid-cloud cost optimization",
    excerpt: "A framework for tagging, rightsizing, and reserved-capacity planning across AWS, Azure, and on-prem footprints.",
    tag: "FinOps", published_at: "2025-07-22", pages: 28, file_size: "3.4 MB", author: "Intrastack Advisory",
  }},
  { slug: "zero-trust-network-reference-architecture", kind: "whitepaper", images: 1, fields: {
    title: "Zero-trust network reference architecture for regulated industries",
    excerpt: "A reference design covering identity-aware proxies, micro-segmentation, and continuous verification for finance and healthcare workloads.",
    tag: "Security", published_at: "2025-05-10", pages: 42, file_size: "5.1 MB", author: "Intrastack Security",
  }},
  { slug: "platform-engineering-maturity-model", kind: "whitepaper", images: 3, fields: {
    title: "A maturity model for internal developer platforms",
    excerpt: "Five stages of platform-engineering practice, with the org signals, capabilities, and golden-path patterns that mark each transition.",
    tag: "Platform", published_at: "2025-08-30", pages: 36, file_size: "4.2 MB", author: "Intrastack Platform",
  }},

  // CLIENT STORIES — already have 1 with 2 images; add 1- and 3-image variants.
  { slug: "global-bank-network-modernization", kind: "client_story", images: 2, fields: {
    title: "How a global bank cut WAN spend 38% with intent-based networking",
    excerpt: "A 14-month rollout consolidated three legacy backbones and unlocked policy-driven traffic engineering across 92 sites.",
    tag: "Networking", published_at: "2025-04-30",
    client: "Tier-1 European Bank", industry: "Financial Services",
    metric_value: "38%", metric_label: "WAN spend reduction",
  }},
  { slug: "retail-edge-rollout-client-story", kind: "client_story", images: 1, fields: {
    title: "A national retailer rolled out edge compute to 1,200 stores in 9 months",
    excerpt: "A zero-touch provisioning pipeline and a hardened OS image turned a multi-year project into a single peak-season program.",
    tag: "Retail", published_at: "2025-06-18",
    client: "National Retail Chain", industry: "Retail",
    metric_value: "1,200", metric_label: "stores online",
  }},
  { slug: "healthcare-data-platform-client-story", kind: "client_story", images: 3, fields: {
    title: "Consolidating 17 clinical data silos into a single governed platform",
    excerpt: "A regional hospital network replaced point-to-point integrations with an event-driven data platform, cutting time-to-insight from weeks to hours.",
    tag: "Healthcare", published_at: "2025-09-01",
    client: "Regional Hospital Network", industry: "Healthcare",
    metric_value: "17→1", metric_label: "data platforms consolidated",
  }},
];

// --- Step 1: insert missing rows with a placeholder cover_image_path -------
console.log("=== Insert missing rows ===");
const { data: existingRows, error: exErr } = await sb
  .from("news_items")
  .select("slug")
  .in("slug", seedPlan.map((r) => r.slug));
if (exErr) throw exErr;
const have = new Set(existingRows.map((r) => r.slug));
const toInsert = seedPlan.filter((r) => !have.has(r.slug));

if (toInsert.length) {
  const insertPayload = toInsert.map((r) => ({
    slug: r.slug,
    kind: r.kind,
    cover_image_path: "__placeholder__", // overwritten in step 3
    ...r.fields,
  }));
  const { error: insErr } = await sb.from("news_items").insert(insertPayload);
  if (insErr) throw insErr;
  console.log(`   inserted ${toInsert.length}: ${toInsert.map((r) => r.slug).join(", ")}`);
} else {
  console.log("   nothing to insert");
}

// --- Step 2: fetch ids for everything in the plan --------------------------
const { data: rows, error: idErr } = await sb
  .from("news_items")
  .select("id,slug")
  .in("slug", seedPlan.map((r) => r.slug));
if (idErr) throw idErr;
const idBySlug = Object.fromEntries(rows.map((r) => [r.slug, r.id]));

// --- Step 3: upload cover (+ extras) and rewrite path columns --------------
console.log("\n=== Upload images and update rows ===");
for (const r of seedPlan) {
  const id = idBySlug[r.slug];
  if (!id) throw new Error(`no row for slug ${r.slug}`);

  // pick `images` files: first is cover, rest are extras
  const files = pick(r.images);
  const uploads = [
    { file: files[0], remote: `${id}/cover.jpg`, column: "cover_image_path" },
    ...(r.images >= 2 ? [{ file: files[1], remote: `${id}/image-2.webp`, column: "image_2_path" }] : []),
    ...(r.images >= 3 ? [{ file: files[2], remote: `${id}/image-3.webp`, column: "image_3_path" }] : []),
  ];

  const updates = { cover_image_path: null, image_2_path: null, image_3_path: null };
  for (const u of uploads) {
    const bytes = await readFile(path.join(IMG_DIR, u.file));
    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(u.remote, bytes, { upsert: true, contentType: "image/webp" });
    if (upErr) throw new Error(`upload ${u.remote}: ${upErr.message}`);
    updates[u.column] = u.remote;
  }

  const { error: dbErr } = await sb.from("news_items").update(updates).eq("id", id);
  if (dbErr) throw new Error(`update ${r.slug}: ${dbErr.message}`);
  console.log(`   ${r.kind.padEnd(13)} ${r.slug.padEnd(48)} ${r.images} image${r.images > 1 ? "s" : ""}`);
}

// --- Step 4: final report --------------------------------------------------
const { data: final } = await sb
  .from("news_items")
  .select("kind,slug,cover_image_path,image_2_path,image_3_path")
  .order("kind")
  .order("slug");
console.log("\n=== Final state ===");
const summary = final.map((r) => ({
  kind: r.kind,
  slug: r.slug,
  images: [r.cover_image_path, r.image_2_path, r.image_3_path].filter(Boolean).length,
}));
console.table(summary);
