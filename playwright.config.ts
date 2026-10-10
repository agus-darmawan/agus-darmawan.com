import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3123);
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL,
		trace: "retain-on-failure",
		// Use a preinstalled Chromium when one is provided (sandboxes, Docker).
		launchOptions: process.env.PW_CHROMIUM_PATH
			? { executablePath: process.env.PW_CHROMIUM_PATH }
			: undefined,
	},
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1366, height: 850 },
			},
			testIgnore: /mobile\.spec\.ts/,
		},
		{
			name: "mobile",
			use: { ...devices["Pixel 7"] },
			testMatch: /mobile\.spec\.ts/,
		},
	],
	webServer: process.env.E2E_BASE_URL
		? undefined
		: {
				// The app builds with `output: "standalone"`, so serve that bundle.
				command: `PORT=${PORT} HOSTNAME=127.0.0.1 pnpm start:standalone`,
				url: `${baseURL}/en`,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
});
