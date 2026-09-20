// Reproducible audit evidence for AUDIT.md.
//
//   node scripts/audit.mjs --base http://localhost:3000 --label before --path /before
//   node scripts/audit.mjs --base http://localhost:3000 --label after  --path /
//
// Run against a production build (npm run build && npm start), never dev.
// Lighthouse runs --runs times (default 3) and the median-performance run is kept.
// Writes audit/<label>/: lighthouse.json (full report), axe.json, mobile.png,
// and summary.json with the headline numbers.
//
// Note on INP: Lighthouse navigation runs cannot measure INP, which needs real
// user interactions. Total Blocking Time is reported as the lab proxy and is
// labelled as such.

import AxeBuilder from "@axe-core/playwright";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, v, i, all) => (v.startsWith("--") ? [...acc, [v.slice(2), all[i + 1]]] : acc), []),
);
const base = args.base ?? "http://localhost:3000";
const label = args.label ?? "after";
const url = new URL(args.path ?? "/", base).toString();
const out = `audit/${label}`;
mkdirSync(out, { recursive: true });

// 1. Lighthouse, mobile preset (Moto G class device, simulated slow 4G), N runs.
const runs = Number(args.runs ?? 3);
const reports = [];
for (let i = 0; i < runs; i++) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
  const { lhr } = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  reports.push(lhr);
  try {
    await chrome.kill();
  } catch {
    // On Windows chrome-launcher can fail to delete its temp profile; harmless.
  }
}
reports.sort((x, y) => x.categories.performance.score - y.categories.performance.score);
const lhr = reports[Math.floor(reports.length / 2)];
writeFileSync(`${out}/lighthouse.json`, JSON.stringify(lhr, null, 1));

// 2. axe-core scan plus a phone screenshot.
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
writeFileSync(`${out}/axe.json`, JSON.stringify(axe, null, 1));
await page.screenshot({ path: `${out}/mobile.png` });
await browser.close();

const a = lhr.audits;
const summary = {
  url,
  label,
  fetchedAt: lhr.fetchTime,
  lighthouseVersion: lhr.lighthouseVersion,
  runs,
  performanceScoresAllRuns: reports.map((r) => Math.round(r.categories.performance.score * 100)),
  scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, c]) => [k, Math.round(c.score * 100)])),
  metrics: {
    lcpMs: Math.round(a["largest-contentful-paint"].numericValue),
    cls: Number(a["cumulative-layout-shift"].numericValue.toFixed(3)),
    tbtMs_labProxyForInp: Math.round(a["total-blocking-time"].numericValue),
    fcpMs: Math.round(a["first-contentful-paint"].numericValue),
    totalBytes: a["total-byte-weight"].numericValue,
  },
  axeViolations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
  failingAudits: Object.values(a)
    .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === "binary")
    .map((x) => x.id),
};
writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
