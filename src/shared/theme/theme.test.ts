import { describe, expect, it } from "vitest";
import { isDark, nextTheme } from "./theme";

describe("theme", () => {
	it("cycles light, dark, system", () => {
		expect([nextTheme("light"), nextTheme("dark"), nextTheme("system")]).toEqual([
			"dark",
			"system",
			"light",
		]);
	});

	it("follows the system preference only for system", () => {
		expect(isDark({ theme: "system", prefersDark: true })).toBe(true);
		expect(isDark({ theme: "light", prefersDark: true })).toBe(false);
	});
});
