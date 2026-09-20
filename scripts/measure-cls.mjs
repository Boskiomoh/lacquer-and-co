// Measures CLS under real (not simulated) network throttling, because
// Lighthouse's simulated mode loads the page unthrottled and so never sees
// unsized images arrive after first paint.
//
//   node scripts/measure-cls.mjs http://localhost:3000/before http://localhost:3000/
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const urls = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
for (const url of urls) {
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    // Roughly "Slow 4G": 400ms RTT, 1.6 Mbps down.
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 400,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(url, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(1500);
    runs.push(await page.evaluate(() => Number(window.__cls.toFixed(3))));
    await context.close();
  }
  results.push({ url, cls: runs });
  console.log(url, "CLS per run:", runs.join(", "));
}
await browser.close();
mkdirSync("audit", { recursive: true });
writeFileSync("audit/cls-throttled.json", JSON.stringify({ measuredAt: new Date().toISOString(), network: "400ms RTT, 1.6 Mbps down, cache disabled, 390x844", results }, null, 2));
