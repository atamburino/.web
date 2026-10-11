/// <reference types="vite/client" />

import type { z } from "zod";
import type { envSchema } from "./shared/config/env";

type ClientEnv = {
	readonly [Key in keyof z.input<typeof envSchema>]: z.input<typeof envSchema>[Key];
};

declare global {
	// Members come from envSchema. An empty body is how TypeScript merges interfaces.
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface ImportMetaEnv extends ClientEnv {}
}

export {};
