import { readFile, rm } from "node:fs/promises";
import { parseArgs } from "node:util";
import { z } from "zod";
import { templateConfig } from "../template.config.ts";
import { rewriteFile, run, writeJson } from "./lib.ts";

const filesWithPlaceholders = ["package.json", "index.html", "README.md", "src/app/AppLayout.tsx"];

const flagSchema = z.object({
	name: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "Use a lowercase npm package name"),
	title: z.string().min(1),
	"api-host": z.url().optional(),
	"api-url": z.url().optional(),
});

const argsSchema = flagSchema.refine(
	(args) => args["api-host"] !== undefined || args["api-url"] !== undefined,
	{ message: "Pass --api-host or --api-url" },
);

if (templateConfig.initialized) throw new Error("This app is already initialized.");

const { values } = parseArgs({
	options: Object.fromEntries(
		Object.keys(flagSchema.shape).map((flag) => [flag, { type: "string" as const }]),
	),
});
const args = argsSchema.parse(values);
const apiHost = args["api-host"] ?? new URL(args["api-url"] ?? "").origin;
const apiUrl = args["api-url"] ?? `${apiHost}/openapi/v1.json`;

async function replacePlaceholders({
	file,
	replacements,
}: {
	file: string;
	replacements: [string, string][];
}) {
	await rewriteFile({
		file,
		transform: (original) =>
			replacements.reduce((text, [from, to]) => text.replaceAll(from, to), original),
	});
}

const { packageName, appTitle } = templateConfig.placeholders;
for (const file of filesWithPlaceholders) {
	await replacePlaceholders({
		file,
		replacements: [
			[packageName, args.name],
			[appTitle, args.title],
		],
	});
}
await replacePlaceholders({
	file: ".env.production",
	replacements: [["https://localhost:5001", apiHost]],
});
await replacePlaceholders({
	file: ".env.example",
	replacements: [["https://localhost:5001", apiHost]],
});

const initializedConfig = {
	initialized: true,
	apiUrl,
	placeholders: { packageName: args.name, appTitle: args.title },
};
await rewriteFile({
	file: "template.config.ts",
	transform: () =>
		`export const templateConfig = ${JSON.stringify(initializedConfig, null, "\t")};\n`,
});

const packageJson = z
	.record(z.string(), z.unknown())
	.parse(JSON.parse(await readFile("package.json", "utf8")));
const { "init:app": _init, ...scripts } = z
	.record(z.string(), z.string())
	.parse(packageJson["scripts"]);
packageJson["scripts"] = scripts;
await writeJson({ file: "package.json", value: packageJson });
await rm("scripts/init.ts");
await rm(".github/workflows/template.yml", { force: true });

run({
	command: "pnpm",
	args: ["exec", "prettier", "--write", "template.config.ts", "package.json"],
});

let specWasPulled = true;
try {
	run({ command: "pnpm", args: ["api:pull"] });
} catch {
	specWasPulled = false;
}
if (specWasPulled) run({ command: "pnpm", args: ["api:generate"] });

console.log(`Initialized ${args.name}.`);
if (!specWasPulled) {
	console.log("The BFF was not reachable. Later run: pnpm api:pull && pnpm api:generate");
}
console.log("Next: commit, push, and enable branch protection on main.");
