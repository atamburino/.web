import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { loadSavedTheme, saveTheme, shouldUseDarkMode, type Theme } from "./theme";

type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);
const prefersDarkQuery = "(prefers-color-scheme: dark)";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState(() => loadSavedTheme(localStorage));
	const prefersDark = useMediaQuery(prefersDarkQuery);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", shouldUseDarkMode({ theme, prefersDark }));
	}, [theme, prefersDark]);

	const setTheme = (next: Theme) => {
		saveTheme({ storage: localStorage, theme: next });
		setThemeState(next);
	};

	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
	const value = useContext(ThemeContext);
	if (value === null) throw new Error("useTheme needs a ThemeProvider");
	return value;
}
