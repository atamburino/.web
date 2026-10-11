import { z } from "zod";
import type { TemplateSampleItem } from "@/shared/api/generated/sample";
import type { ExampleStatusFilter } from "./search";

const exampleItemIdSchema = z.string().brand<"ExampleItemId">();

export type ExampleItemId = z.infer<typeof exampleItemIdSchema>;
export type ExampleItem = {
	id: ExampleItemId;
	name: string;
	status: TemplateSampleItem["status"];
	createdAt: Date;
};

export function toExampleItem(dto: TemplateSampleItem): ExampleItem {
	return {
		id: exampleItemIdSchema.parse(dto.id),
		name: dto.name,
		status: dto.status,
		createdAt: new Date(dto.createdAt),
	};
}

export function filterByStatus({
	items,
	status,
}: {
	items: readonly ExampleItem[];
	status: ExampleStatusFilter;
}): ExampleItem[] {
	return status === "all" ? [...items] : items.filter((item) => item.status === status);
}
