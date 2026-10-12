import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

export function capitalizeFirstLetter(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function pascalCase(text: string): string {
	return text
		.split(/[^A-Za-z0-9]+/)
		.filter((part) => part.length > 0)
		.map((part) => capitalizeFirstLetter(part))
		.join("");
}

export async function writeJson({ file, value }: { file: string; value: unknown }) {
	await writeFile(file, `${JSON.stringify(value, null, "\t")}\n`);
}

export async function rewriteFile({
	file,
	transform,
}: {
	file: string;
	transform: (text: string) => string;
}) {
	const text = await readFile(file, "utf8");
	await writeFile(file, transform(text));
}

export function run({ command, args = [] }: { command: string; args?: readonly string[] }) {
	const result = spawnSync(command, [...args], { stdio: "inherit" });
	if (result.status !== 0) {
		throw new Error(`${command} ${args.join(" ")} exited with ${String(result.status)}`);
	}
}
