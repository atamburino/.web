import { describe, expect, it } from "vitest";
import { nextThemeInCycle, shouldUseDarkMode } from "./theme";

describe("theme", () => {
	it("cycles light, dark, system", () => {
		expect([
			nextThemeInCycle("light"),
			nextThemeInCycle("dark"),
			nextThemeInCycle("system"),
		]).toEqual(["dark", "system", "light"]);
	});

	it("follows the system preference only for system", () => {
		expect(shouldUseDarkMode({ theme: "system", prefersDark: true })).toBe(true);
		expect(shouldUseDarkMode({ theme: "light", prefersDark: true })).toBe(false);
	});
});
