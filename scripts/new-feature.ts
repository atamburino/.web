import { existsSync } from "node:fs";
import { cp, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { z } from "zod";
import { pascalCase, rewriteFile, run } from "./lib.ts";

const name = z
	.string()
	.regex(/^[a-z][a-zA-Z0-9]*$/, "Use a camelCase name such as orders")
	.parse(process.argv[2]);
const pascalName = pascalCase(name);

function renameSampleText(text: string) {
	// Generated sample names such as getTemplateSampleItems contain "SampleItem".
	// The copy still imports them, so leave those identifiers alone.
	const kept = new Map<string, string>();
	const shielded = text.replaceAll(/[A-Za-z]*TemplateSampleItem[A-Za-z]*/g, (match) => {
		const token = `__KEEP_${String(kept.size)}__`;
		kept.set(token, match);
		return token;
	});
	let renamed = shielded
		.replaceAll("SampleItems", pascalName)
		.replaceAll("sampleItems", name)
		.replaceAll("SampleItem", pascalName)
		.replaceAll("sampleItem", name)
		.replaceAll('createFileRoute("/")', `createFileRoute("/${name}")`)
		.replaceAll('renderApp("/', `renderApp("/${name}`);
	for (const [token, original] of kept) renamed = renamed.replaceAll(token, original);
	return renamed;
}

async function sourceFilesIn(folder: string): Promise<string[]> {
	const entries = await readdir(folder, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const path = join(folder, entry.name);
		if (entry.isDirectory()) files.push(...(await sourceFilesIn(path)));
		else if (path.endsWith(".ts") || path.endsWith(".tsx")) files.push(path);
	}
	return files;
}

const featureDir = join("src/features", name);
if (existsSync(featureDir)) throw new Error(`${featureDir} already exists`);

await cp("src/features/sampleItems", featureDir, { recursive: true });
for (const file of await sourceFilesIn(featureDir)) {
	await rewriteFile({ file, transform: renameSampleText });
	await rename(file, join(dirname(file), renameSampleText(basename(file))));
}

const indexRouteSource = await readFile("src/routes/index.tsx", "utf8");
await writeFile(join("src/routes", `${name}.tsx`), renameSampleText(indexRouteSource));
run({ command: "pnpm", args: ["exec", "tsr", "generate"] });

console.log(`Created ${featureDir} and src/routes/${name}.tsx at /${name}.`);
console.log(`Lint fails until ${featureDir}/api.ts and model.ts import the bff API.`);
