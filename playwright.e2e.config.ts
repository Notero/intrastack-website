import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  // All specs hit one shared `next dev` server plus the real Dev Supabase
  // project. The flow spec already forces serial internally; running other
  // spec files concurrently alongside it was straining dev-mode route
  // compilation and causing spurious timeouts, so keep the whole e2e run
  // single-worker for reliability over wall-clock time.
  workers: 1,
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  outputDir: "./test-results-e2e",
  reporter: [["html", { outputFolder: "playwright-report-e2e", open: "never" }]],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:3000" },
});
