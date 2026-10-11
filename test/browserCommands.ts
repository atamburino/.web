import type {} from "@vitest/browser-playwright";
import type { BrowserCommand } from "vitest/node";

type MediaOptions = { reducedMotion?: "reduce" | "no-preference"; colorScheme?: "light" | "dark" };

const emulateMedia: BrowserCommand<[MediaOptions]> = async (context, options) => {
	await context.page.emulateMedia(options);
};

export const commands = { emulateMedia };

declare module "vitest/browser" {
	interface BrowserCommands {
		emulateMedia: (options: MediaOptions) => Promise<void>;
	}
}
