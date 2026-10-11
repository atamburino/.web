import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { isDark, readStoredTheme, storeTheme, type Theme } from "./theme";

type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);
const darkQuery = "(prefers-color-scheme: dark)";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState(() => readStoredTheme(localStorage));
	const [prefersDark, setPrefersDark] = useState(() => matchMedia(darkQuery).matches);

	useEffect(() => {
		const query = matchMedia(darkQuery);
		const onChange = () => setPrefersDark(query.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark({ theme, prefersDark }));
	}, [theme, prefersDark]);

	const setTheme = (next: Theme) => {
		storeTheme({ storage: localStorage, theme: next });
		setThemeState(next);
	};

	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
	const value = useContext(ThemeContext);
	if (value === null) throw new Error("useTheme needs a ThemeProvider");
	return value;
}
