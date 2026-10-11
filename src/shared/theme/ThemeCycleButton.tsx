import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { nextThemeInCycle, type Theme } from "./theme";
import { useTheme } from "./ThemeProvider";

const themeIcons = { light: Sun, dark: Moon, system: Monitor } satisfies Record<Theme, unknown>;

export function ThemeCycleButton() {
	const { theme, setTheme } = useTheme();
	const Icon = themeIcons[theme];
	const nextTheme = nextThemeInCycle(theme);
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={`Theme: ${theme}. Switch to ${nextTheme}.`}
			onClick={() => setTheme(nextTheme)}
		>
			<Icon />
		</Button>
	);
}
