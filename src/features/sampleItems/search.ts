import { z } from "zod";

export const statusChoices = ["all", "active", "archived"] as const;

export const sampleItemFiltersSchema = z.object({
	nameContains: z.string().default("").catch(""),
	status: z.enum(statusChoices).default("all").catch("all"),
});

export type SampleItemFilters = z.infer<typeof sampleItemFiltersSchema>;
export type StatusChoice = SampleItemFilters["status"];

export type SampleItemFilterProps = {
	filters: SampleItemFilters;
	onFiltersChange: (filters: SampleItemFilters) => void;
};
