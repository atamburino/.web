import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@hey-api/openapi-ts";
import { generateEndpoints } from "@rtk-query/codegen-openapi";
import { apiSpecs, generatedRoot } from "./apiSpecs.ts";
import { jsonOperationIds } from "./openApiSpec.ts";

const pascal = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

function validationSource(operationIds: string[]): string {
	const imports = operationIds.map((id) => `z${pascal(id)}Response`);
	const entries = operationIds.map(
		(id) => `\t\t${id}: { responseSchema: z${pascal(id)}Response },`,
	);
	return [
		`import { api } from "./endpoints.gen";`,
		imports.length > 0 ? `import { ${imports.join(", ")} } from "./zod.gen";` : "",
		"",
		"export const validatedApi = api.enhanceEndpoints({",
		"\tendpoints: {",
		...entries,
		"\t},",
		"});",
		"",
	].join("\n");
}

const indexSource = [
	`export * from "./endpoints.gen";`,
	`export { validatedApi as api } from "./validation.gen";`,
	"",
].join("\n");

for (const { name, file } of apiSpecs) {
	const outDir = resolve(generatedRoot, name);
	await rm(outDir, { recursive: true, force: true });
	await mkdir(outDir, { recursive: true });

	await generateEndpoints({
		schemaFile: `./${file}`,
		apiFile: "./src/shared/api/baseApi.ts",
		apiImport: "baseApi",
		outputFile: `./${generatedRoot}/${name}/endpoints.gen.ts`,
		exportName: "api",
		hooks: true,
	});

	await createClient({
		input: resolve(file),
		output: { path: outDir, clean: false },
		plugins: ["zod"],
		logs: { level: "silent" },
	});

	const spec: unknown = JSON.parse(await readFile(resolve(file), "utf8"));
	await writeFile(resolve(outDir, "validation.gen.ts"), validationSource(jsonOperationIds(spec)));
	await writeFile(resolve(outDir, "index.ts"), indexSource);
}
