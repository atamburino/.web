import { z } from "zod";

const envSchema = z.object({
	VITE_BFF_URL: z.string().min(1),
	VITE_FAKE_BFF: z.stringbool().default(false),
});

export const env = envSchema.parse(import.meta.env);
