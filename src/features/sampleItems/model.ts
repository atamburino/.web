import { z } from "zod";
import type { TemplateSampleItem } from "@/shared/api/generated/sample";
import type { StatusChoice } from "./search";

const sampleItemIdSchema = z.string().brand<"SampleItemId">();

export type SampleItemId = z.infer<typeof sampleItemIdSchema>;
export type SampleItem = {
	id: SampleItemId;
	name: string;
	status: TemplateSampleItem["status"];
	createdAt: Date;
};

export function toSampleItem(serverItem: TemplateSampleItem): SampleItem {
	return {
		id: sampleItemIdSchema.parse(serverItem.id),
		name: serverItem.name,
		status: serverItem.status,
		createdAt: new Date(serverItem.createdAt),
	};
}

export function filterByStatus({
	items,
	status,
}: {
	items: readonly SampleItem[];
	status: StatusChoice;
}): SampleItem[] {
	return status === "all" ? [...items] : items.filter((item) => item.status === status);
}
