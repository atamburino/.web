import { z } from "zod";

export const themeSchema = z.enum(["light", "dark", "system"]);
export type Theme = z.infer<typeof themeSchema>;

const themeStorageKey = "theme";

export function loadSavedTheme(storage: Storage): Theme {
	return themeSchema.catch("system").parse(storage.getItem(themeStorageKey));
}

export function saveTheme({ storage, theme }: { storage: Storage; theme: Theme }) {
	storage.setItem(themeStorageKey, theme);
}

export function nextThemeInCycle(theme: Theme): Theme {
	switch (theme) {
		case "light":
			return "dark";
		case "dark":
			return "system";
		case "system":
			return "light";
		default: {
			const _exhaustive: never = theme;
			return _exhaustive;
		}
	}
}

export function shouldUseDarkMode({ theme, prefersDark }: { theme: Theme; prefersDark: boolean }) {
	return theme === "dark" || (theme === "system" && prefersDark);
}
