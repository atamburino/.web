import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@hey-api/openapi-ts";
import { generateEndpoints } from "@rtk-query/codegen-openapi";
import { apiSpecs, generatedApiFolder } from "./apiSpecs.ts";
import { capitalizeFirstLetter } from "./lib.ts";
import { operationIdsWithJsonResponse } from "./operationIds.ts";

function buildValidationFileText(operationIds: string[]): string {
	const schemaNames = operationIds.map((id) => `z${capitalizeFirstLetter(id)}Response`);
	const entries = operationIds.map(
		(id) => `\t\t${id}: { responseSchema: z${capitalizeFirstLetter(id)}Response },`,
	);
	return [
		`import { api } from "./endpoints.gen";`,
		schemaNames.length > 0 ? `import { ${schemaNames.join(", ")} } from "./zod.gen";` : "",
		"",
		"export const validatedApi = api.enhanceEndpoints({",
		"\tendpoints: {",
		...entries,
		"\t},",
		"});",
		"",
	].join("\n");
}

function indexFileText(apiName: "bffApi" | "sampleApi"): string {
	return [
		`export * from "./endpoints.gen";`,
		`export { validatedApi as ${apiName} } from "./validation.gen";`,
		"",
	].join("\n");
}

for (const { name, file } of apiSpecs) {
	const outputFolder = resolve(generatedApiFolder, name);
	await rm(outputFolder, { recursive: true, force: true });
	await mkdir(outputFolder, { recursive: true });

	await generateEndpoints({
		schemaFile: `./${file}`,
		apiFile: "./src/shared/api/baseApi.ts",
		apiImport: "baseApi",
		outputFile: `./${generatedApiFolder}/${name}/endpoints.gen.ts`,
		exportName: "api",
		hooks: true,
	});

	await createClient({
		input: resolve(file),
		output: { path: outputFolder, clean: false },
		plugins: ["zod"],
		logs: { level: "silent" },
	});

	const specJson: unknown = JSON.parse(await readFile(resolve(file), "utf8"));
	await writeFile(
		resolve(outputFolder, "validation.gen.ts"),
		buildValidationFileText(operationIdsWithJsonResponse(specJson)),
	);
	await writeFile(
		resolve(outputFolder, "index.ts"),
		indexFileText(name === "bff" ? "bffApi" : "sampleApi"),
	);
}
