import { describe, expect, it } from "vitest";
import { filterByStatus, toSampleItem } from "./model";
import { sampleItemFiltersSchema } from "./search";

const serverItem = {
	id: "6f1c2a4e-1b7d-4c1e-9a55-0a1b2c3d4e01",
	name: "First",
	status: "active",
	createdAt: "2026-10-01T09:00:00Z",
} as const;

describe("toSampleItem", () => {
	it("parses the date and keeps the id", () => {
		const item = toSampleItem(serverItem);
		expect(item.id).toBe(serverItem.id);
		expect(item.createdAt.toISOString()).toBe("2026-10-01T09:00:00.000Z");
	});
});

describe("filterByStatus", () => {
	const items = [
		toSampleItem(serverItem),
		toSampleItem({ ...serverItem, id: "b", status: "archived" }),
	];

	it("keeps every item for all", () => {
		expect(filterByStatus({ items, status: "all" })).toHaveLength(2);
	});

	it("keeps only matching items", () => {
		expect(filterByStatus({ items, status: "archived" }).map((item) => item.id)).toEqual(["b"]);
	});
});

describe("sampleItemFiltersSchema", () => {
	it("fills defaults for a missing or invalid search", () => {
		expect(sampleItemFiltersSchema.parse({ status: "bogus" })).toEqual({
			nameContains: "",
			status: "all",
		});
	});
});
