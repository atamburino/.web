import { z } from "zod";

const operationSchema = z.object({
	operationId: z.string(),
	responses: z.record(
		z.string(),
		z.object({ content: z.record(z.string(), z.unknown()).optional() }),
	),
});

const specSchema = z.object({
	paths: z.record(z.string(), z.record(z.string(), z.unknown())).default({}),
});

export function jsonOperationIds(raw: unknown): string[] {
	return Object.values(specSchema.parse(raw).paths)
		.flatMap((pathItem) => Object.values(pathItem))
		.flatMap((candidate) => {
			const parsed = operationSchema.safeParse(candidate);
			return parsed.success ? [parsed.data] : [];
		})
		.filter((op) => op.responses["200"]?.content?.["application/json"] !== undefined)
		.map((op) => op.operationId);
}
