import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { nextTheme, type Theme } from "./theme";
import { useTheme } from "./ThemeProvider";

const icons = { light: Sun, dark: Moon, system: Monitor } satisfies Record<Theme, unknown>;

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const Icon = icons[theme];
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={`Theme: ${theme}. Switch to ${nextTheme(theme)}.`}
			onClick={() => setTheme(nextTheme(theme))}
		>
			<Icon />
		</Button>
	);
}
