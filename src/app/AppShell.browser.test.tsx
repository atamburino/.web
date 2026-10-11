import { describe, expect, it } from "vitest";
import { commands } from "vitest/browser";
import { renderApp } from "../../test/renderApp";

describe("app shell", () => {
	it("toggles the dark class on <html>", async () => {
		const { screen } = await renderApp("/");
		await screen.getByRole("button", { name: /Theme: system/ }).click();
		await screen.getByRole("button", { name: /Theme: light/ }).click();
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("renders the static heading when the user prefers reduced motion", async () => {
		await commands.emulateMedia({ reducedMotion: "reduce" });
		const { screen } = await renderApp("/");
		const heading = screen.getByText("Reference feature");
		await expect.element(heading).toBeVisible();
		expect(heading.element().tagName).toBe("P");
		expect(heading.element().querySelector("span")).toBeNull();
	});
});
