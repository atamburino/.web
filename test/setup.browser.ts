import "@/shared/styles/globals.css";
import { afterAll, afterEach, beforeAll } from "vitest";
import { commands } from "vitest/browser";
import { fakeBff, startFakeBff } from "@/fakeBff/browser";

beforeAll(startFakeBff);

afterEach(async () => {
	fakeBff.resetHandlers();
	localStorage.clear();
	document.documentElement.classList.remove("dark");
	await commands.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
});

afterAll(() => fakeBff.stop());
