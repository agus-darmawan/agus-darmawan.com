import { expect, type Page, test } from "@playwright/test";
import { launch, openDesktop, windowNamed } from "./helpers";

async function run(page: Page, command: string, label = "Command") {
	const input = page.getByRole("textbox", { name: label });
	await input.fill(command);
	await input.press("Enter");
}

test.beforeEach(async ({ page }) => {
	await openDesktop(page);
	await launch(page, "Terminal");
});

test("prototype keys don't crash the shell", async ({ page }) => {
	await run(page, "cat __proto__");
	await expect(page.getByRole("log")).toContainText(
		"No such file or directory",
	);
});

test("vim :wq saves the file", async ({ page }) => {
	await run(page, "echo hello > note.txt");
	await run(page, "vim note.txt");
	await expect(page.getByRole("textbox", { name: /Vim editor/ })).toBeFocused();
	for (const key of ["A", "!", "Escape", ":", "w", "q", "Enter"])
		await page.keyboard.press(key);
	await run(page, "cat note.txt");
	await expect(page.getByRole("log")).toContainText("hello!");
});

test("Tab completes commands", async ({ page }) => {
	const input = page.getByRole("textbox", { name: "Command" });
	await input.fill("neo");
	await input.press("Tab");
	await expect(input).toHaveValue("neofetch ");
});

test("open/close drive other windows; close never closes the terminal", async ({
	page,
}) => {
	await run(page, "open about");
	await expect(windowNamed(page, "About Me")).toBeVisible();
	await windowNamed(page, "Terminal").dispatchEvent("mousedown");
	await run(page, "close");
	await expect(windowNamed(page, "About Me")).toHaveCount(0);
	await expect(windowNamed(page, "Terminal")).toBeVisible();
});

test("the session survives a language switch", async ({ page }) => {
	await run(page, "echo persistent");
	await run(page, "lang id");
	await expect(page).toHaveURL(/\/id$/);
	await expect(page.getByRole("log")).toContainText("persistent");
	await run(page, "exit", "Perintah");
	await expect(windowNamed(page, "Terminal")).toHaveCount(0);
});
