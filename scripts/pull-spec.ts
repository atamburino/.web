import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { z } from "zod";
import { templateConfig } from "../template.config.ts";

const { values } = parseArgs({ options: { from: { type: "string" } } });
const url = values.from ?? templateConfig.apiUrl;

const response = await fetch(url);
if (!response.ok) throw new Error(`GET ${url} answered ${String(response.status)}`);

const spec = z.looseObject({ openapi: z.string() }).parse(await response.json());
await writeFile("api/openapi.json", `${JSON.stringify(spec, null, "\t")}\n`);
console.log(`Wrote api/openapi.json from ${url}. Run pnpm api:gen next.`);
