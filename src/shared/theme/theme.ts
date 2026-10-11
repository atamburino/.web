import { z } from "zod";

export const themeSchema = z.enum(["light", "dark", "system"]);
export type Theme = z.infer<typeof themeSchema>;

const storageKey = "theme";

export function readStoredTheme(storage: Storage): Theme {
	return themeSchema.catch("system").parse(storage.getItem(storageKey));
}

export function storeTheme({ storage, theme }: { storage: Storage; theme: Theme }) {
	storage.setItem(storageKey, theme);
}

export function nextTheme(theme: Theme): Theme {
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

export function isDark({ theme, prefersDark }: { theme: Theme; prefersDark: boolean }) {
	return theme === "dark" || (theme === "system" && prefersDark);
}
