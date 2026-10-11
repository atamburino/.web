import { z } from "zod";

export const exampleStatusFilters = ["all", "active", "archived"] as const;

export const exampleSearchSchema = z.object({
	q: z.string().default("").catch(""),
	status: z.enum(exampleStatusFilters).default("all").catch("all"),
});

export type ExampleSearch = z.infer<typeof exampleSearchSchema>;
export type ExampleStatusFilter = ExampleSearch["status"];
