import { defineConfig } from "@playwright/test";

// Runs against a production server. Start one first (npm run build && npm start)
// or let Playwright start it. BASE_URL overrides the default port.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    // Uses the locally installed Chrome, no browser download needed.
    channel: "chrome",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
