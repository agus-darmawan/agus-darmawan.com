import { expect, test } from "@playwright/test";
import { launch, openDesktop, windowNamed } from "./helpers";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		sessionStorage.setItem("hasBooted", "1");
		localStorage.setItem("onboardingSeen", "1");
	});
});

test("a write-up has highlighted code and a table of contents", async ({
	page,
}) => {
	await page.goto("/en/projects/icar4-its");
	const article = page.getByRole("main").getByRole("article");

	// Highlighted on the server: theme colours on every token, no client JS.
	const code = article.locator(".md-code").first();
	await expect(code).toContainText("C++");
	await expect(
		code.locator('span[style*="--shiki-dark"]').first(),
	).toBeAttached();
	await expect(code.getByRole("button", { name: "Copy code" })).toBeVisible();

	const toc = page.getByRole("navigation", { name: "Contents" });
	const entry = toc.getByRole("link", {
		name: "A workspace you can diff against",
	});
	await entry.click();
	await expect(page).toHaveURL(/#a-workspace-you-can-diff-against$/);
	await expect(entry).toHaveAttribute("aria-current", "location");
	await expect(
		page.getByRole("heading", { name: "A workspace you can diff against" }),
	).toBeInViewport();
});

test("likes stick for the same visitor", async ({ page }) => {
	await page.goto("/en/blog/building-ubuntu-portfolio");
	const like = page.getByRole("button", { name: /^Like/ });
	await expect(like).toHaveAttribute("aria-pressed", "false");
	await like.click();
	await expect(like).toHaveAttribute("aria-pressed", "true");
	await expect(like).toContainText("1");

	await page.reload();
	await expect(page.getByRole("button", { name: /^Like/ })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await page.getByRole("button", { name: /^Like/ }).click();
	await expect(page.getByRole("button", { name: /^Like/ })).toHaveAttribute(
		"aria-pressed",
		"false",
	);
});

test("the project list filters as you type", async ({ page }) => {
	await page.goto("/en/projects");
	const cards = page.getByRole("main").getByRole("article");
	const all = await cards.count();
	await page.getByRole("searchbox", { name: "Search projects" }).fill("drone");
	await expect(cards).not.toHaveCount(all);
	await expect(cards.first()).toContainText(/drone/i);

	await page.getByRole("searchbox", { name: "Search projects" }).fill("zzzz");
	await expect(page.getByText("No projects match “zzzz”.")).toBeVisible();
	await page.getByRole("button", { name: "Clear search" }).click();
	await expect(cards).toHaveCount(all);
});

test("the desktop window renders the same article", async ({ page }) => {
	await openDesktop(page);
	await launch(page, "Blog");
	const win = windowNamed(page, "Blog");
	await win.getByRole("link").first().click();

	await expect(win.locator(".md-code").first()).toContainText(
		"useWindowStore.ts",
	);
	await expect(win.getByRole("button", { name: /^Like/ })).toBeVisible();
	// In-page links scroll the window and leave the address alone.
	await win
		.getByRole("navigation", { name: "Contents" })
		.getByRole("link")
		.last()
		.click();
	await expect(page).toHaveURL(/\/en\/desktop$/);
	const heading = win.getByRole("heading", { name: "The Concept" });
	await heading.getByRole("link").click();
	await expect(page).toHaveURL(/\/en\/desktop$/);
	await expect(heading).toBeInViewport();
});

test("tabs switch code blocks and math is typeset", async ({ page }) => {
	await page.goto("/en/blog/building-ubuntu-portfolio");
	const tabs = page.getByRole("tablist");
	const second = tabs.getByRole("tab", { name: "page.tsx" });
	await expect(second).toHaveAttribute("aria-selected", "false");
	await expect(page.getByText("addEventListener")).toBeHidden();
	await second.click();
	await expect(second).toHaveAttribute("aria-selected", "true");
	await expect(page.getByText("addEventListener")).toBeVisible();
	await second.press("ArrowLeft");
	await expect(
		tabs.getByRole("tab", { name: "Terminal command processor" }),
	).toBeFocused();

	await page.goto("/en/projects/pashupati");
	await expect(page.locator(".katex-display").first()).toBeVisible();
});
