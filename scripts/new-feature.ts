import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

const name = z
	.string()
	.regex(/^[a-z][a-zA-Z0-9]*$/, "Use a camelCase name such as orders")
	.parse(process.argv[2]);
const pascal = name.charAt(0).toUpperCase() + name.slice(1);

const renameFeature = (text: string) =>
	text
		.replaceAll("Example", pascal)
		.replaceAll("example", name)
		.replaceAll('createFileRoute("/")', `createFileRoute("/${name}")`)
		.replaceAll('renderApp("/', `renderApp("/${name}`);

const featureDir = join("src/features", name);
if (existsSync(featureDir)) throw new Error(`${featureDir} already exists`);

await cp("src/features/example", featureDir, { recursive: true });
for (const file of await readdir(featureDir)) {
	const path = join(featureDir, file);
	await writeFile(path, renameFeature(await readFile(path, "utf8")));
	await rename(path, join(featureDir, renameFeature(file)));
}

const route = await readFile("src/routes/index.tsx", "utf8");
await writeFile(join("src/routes", `${name}.tsx`), renameFeature(route));
spawnSync("pnpm", ["exec", "tsr", "generate"], { stdio: "inherit" });

console.log(`Created ${featureDir} and src/routes/${name}.tsx at /${name}.`);
console.log(`Lint fails until ${featureDir}/api.ts and model.ts use the real generated API.`);
