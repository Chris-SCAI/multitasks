import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  timeout: 180000,
  use: {
    baseURL: "http://localhost:3456",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: [
        "payment-flow.spec.ts",
        "navigation.spec.ts",
        "analysis-flow.spec.ts",
        "domains.spec.ts",
        "onboarding.spec.ts",
        "create-task.spec.ts",
      ],
    },
  ],
});
