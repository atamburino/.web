import { zGetTemplateSampleItemsResponse } from "@/shared/api/generated/sample/zod.gen";

export const sampleItems = zGetTemplateSampleItemsResponse.parse([
	{
		id: "6f1c2a4e-1b7d-4c1e-9a55-0a1b2c3d4e01",
		name: "Generate hooks from the BFF spec",
		status: "active",
		createdAt: "2026-10-01T09:00:00Z",
	},
	{
		id: "6f1c2a4e-1b7d-4c1e-9a55-0a1b2c3d4e02",
		name: "Validate responses with zod",
		status: "active",
		createdAt: "2026-10-02T09:00:00Z",
	},
	{
		id: "6f1c2a4e-1b7d-4c1e-9a55-0a1b2c3d4e03",
		name: "Parse search params at the route",
		status: "active",
		createdAt: "2026-10-03T09:00:00Z",
	},
	{
		id: "6f1c2a4e-1b7d-4c1e-9a55-0a1b2c3d4e04",
		name: "Hand-written fetch wrappers",
		status: "archived",
		createdAt: "2026-09-12T09:00:00Z",
	},
]);
