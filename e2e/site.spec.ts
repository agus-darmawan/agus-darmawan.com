import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { windowNamed } from "./helpers";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		sessionStorage.setItem("hasBooted", "1");
		localStorage.setItem("onboardingSeen", "1");
	});
});

const openDesktopLink = (page: Page) =>
	page.getByRole("banner").getByRole("link", { name: "Open desktop" });

const uiMode = async (context: BrowserContext) =>
	(await context.cookies()).find((c) => c.name === "ui-mode")?.value;

test("home is the website, with the name as its heading", async ({ page }) => {
	await page.goto("/en");
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"Agus Darmawan",
	);
	await expect(
		page.getByRole("link", { name: "Launch the desktop" }),
	).toBeVisible();
	await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("experience has its own page; about no longer lists it", async ({
	page,
}) => {
	await page.goto("/en/experience");
	await expect(
		page.getByRole("heading", { level: 1, name: "Experience" }),
	).toBeVisible();
	await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();

	await page.goto("/en/about");
	await expect(
		page.getByRole("heading", { level: 2, name: /experience/i }),
	).toHaveCount(0);
});

test("the desktop opens on the project you were reading", async ({ page }) => {
	await page.goto("/en/projects");
	const firstProject = page.getByRole("main").getByRole("article").first();
	const title = (await firstProject.getByRole("heading").textContent()) ?? "";
	await firstProject.getByRole("link").click();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);

	await openDesktopLink(page).click();
	await expect(page).toHaveURL(/\/en\/desktop$/);
	await expect(
		windowNamed(page, "Projects").getByRole("heading", { name: title }),
	).toBeVisible();
});

test("switching views is remembered on the bare domain", async ({
	page,
	context,
}) => {
	await page.goto("/en/about");
	await openDesktopLink(page).click();
	await expect(windowNamed(page, "About Me")).toBeVisible();
	expect(await uiMode(context)).toBe("desktop");

	// Back to the website, on the page for the window in front.
	await page.getByRole("link", { name: "Website", exact: true }).click();
	await expect(page).toHaveURL(/\/en\/about$/);
	expect(await uiMode(context)).toBe("classic");
	await page.goto("/");
	await expect(page).toHaveURL(/\/en$/);

	await openDesktopLink(page).click();
	await expect(page).toHaveURL(/\/en\/desktop$/);
	await page.goto("/");
	await expect(page).toHaveURL(/\/en\/desktop$/);
});

test("Back still works after landing on a desktop deep link", async ({
	page,
}) => {
	await page.goto("/en/projects");
	const href =
		(await page
			.getByRole("main")
			.getByRole("article")
			.first()
			.getByRole("link")
			.getAttribute("href")) ?? "";
	const slug = href.split("/").at(-1);

	// A full page load straight onto the deep link.
	await page.goto(`/en/desktop?open=projects&item=${slug}`);
	await expect(page).toHaveURL(/\/en\/desktop$/);
	await expect(windowNamed(page, "Projects")).toBeVisible();

	await page.getByRole("link", { name: "Website", exact: true }).click();
	await expect(page).toHaveURL(new RegExp(`/en/projects/${slug}$`));
	await page.goBack();
	await expect(page).toHaveURL(/\/en\/desktop$/);
	await expect(windowNamed(page, "Projects")).toBeVisible();
});

test("the skip link moves focus without adding history", async ({ page }) => {
	await page.goto("/en/projects");
	await page.keyboard.press("Tab");
	await expect(
		page.getByRole("link", { name: "Skip to content" }),
	).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("main")).toBeFocused();
	await expect(page).toHaveURL(/\/en\/projects$/);
});

test("the terminal can leave for the website", async ({ page }) => {
	await page.goto("/en/desktop?open=terminal");
	const input = page.getByRole("textbox", { name: "Command" });
	await input.fill("website");
	await input.press("Enter");
	await expect(page).toHaveURL(/\/en$/);
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
