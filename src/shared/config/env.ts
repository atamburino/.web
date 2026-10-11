import { z } from "zod";

export const envSchema = z.object({
	VITE_BFF_URL: z.string().min(1),
	VITE_FAKE_BFF: z.enum(["true", "false"]),
});

export const env = envSchema.parse({
	VITE_BFF_URL: import.meta.env.VITE_BFF_URL,
	VITE_FAKE_BFF: import.meta.env.VITE_FAKE_BFF,
});
