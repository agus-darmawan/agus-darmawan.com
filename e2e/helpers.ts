import type { Page } from "@playwright/test";

/** Open the desktop with the boot animation and onboarding tour skipped. */
export async function openDesktop(page: Page, locale: "en" | "id" = "en") {
	await page.addInitScript(() => {
		sessionStorage.setItem("hasBooted", "1");
		localStorage.setItem("onboardingSeen", "1");
	});
	await page.goto(`/${locale}/desktop`);
	await page.getByRole("navigation", { name: "Dock" }).waitFor();
}

export const dock = (page: Page) =>
	page.getByRole("navigation", { name: "Dock" });

export const windowNamed = (page: Page, name: string) =>
	page.getByRole("region", { name, exact: true });

export async function launch(page: Page, app: string) {
	await dock(page).getByRole("button", { name: app, exact: true }).click();
	await windowNamed(page, app).waitFor();
}
