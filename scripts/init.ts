import { spawnSync } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { z } from "zod";
import { templateConfig } from "../template.config.ts";

const filesWithPlaceholders = ["package.json", "index.html", "README.md", "src/app/AppShell.tsx"];

const argsSchema = z
	.object({
		name: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "Use a lowercase npm package name"),
		title: z.string().min(1),
		"api-host": z.url().optional(),
		"api-url": z.url().optional(),
	})
	.refine((args) => args["api-host"] !== undefined || args["api-url"] !== undefined, {
		message: "Pass --api-host or --api-url",
	});

if (templateConfig.initialized) throw new Error("This app is already initialized.");

const { values } = parseArgs({
	options: {
		name: { type: "string" },
		title: { type: "string" },
		"api-host": { type: "string" },
		"api-url": { type: "string" },
	},
});
const args = argsSchema.parse(values);
const apiHost = args["api-host"] ?? new URL(args["api-url"] ?? "").origin;
const apiUrl = args["api-url"] ?? `${apiHost}/openapi/v1.json`;

async function replaceInFile({ file, pairs }: { file: string; pairs: [string, string][] }) {
	const text = await readFile(file, "utf8");
	await writeFile(
		file,
		pairs.reduce((acc, [from, to]) => acc.replaceAll(from, to), text),
	);
}

const { name, title } = templateConfig.placeholders;
for (const file of filesWithPlaceholders) {
	await replaceInFile({
		file,
		pairs: [
			[name, args.name],
			[title, args.title],
		],
	});
}
await replaceInFile({ file: ".env.production", pairs: [["https://localhost:5001", apiHost]] });
await replaceInFile({ file: ".env.example", pairs: [["https://localhost:5001", apiHost]] });

const config = { initialized: true, apiUrl, placeholders: { name: args.name, title: args.title } };
await writeFile(
	"template.config.ts",
	`export const templateConfig = ${JSON.stringify(config, null, "\t")};\n`,
);

const packageJson = z
	.record(z.string(), z.unknown())
	.parse(JSON.parse(await readFile("package.json", "utf8")));
const { "init:app": _init, ...scripts } = z
	.record(z.string(), z.string())
	.parse(packageJson["scripts"]);
packageJson["scripts"] = scripts;
await writeFile("package.json", `${JSON.stringify(packageJson, null, "\t")}\n`);
await rm("scripts/init.ts");
await rm(".github/workflows/template.yml", { force: true });

spawnSync("pnpm", ["exec", "prettier", "--write", "template.config.ts", "package.json"], {
	stdio: "ignore",
});

const pulled = spawnSync("pnpm", ["api:pull"], { stdio: "inherit" }).status === 0;
if (pulled) spawnSync("pnpm", ["api:gen"], { stdio: "inherit" });

console.log(`Initialized ${args.name}.`);
if (!pulled) console.log(`The BFF was not reachable. Later run: pnpm api:pull && pnpm api:gen`);
console.log("Next: commit, push, and enable branch protection on main.");
