import { readdir, readFile } from "node:fs/promises";
import { build } from "vite";
import { describe, expect, it } from "vitest";

describe("production bundle", () => {
	it("leaves the fake BFF out of the production bundle", async () => {
		const savedFakeBff = process.env["VITE_FAKE_BFF"];
		const savedBffUrl = process.env["VITE_BFF_URL"];
		delete process.env["VITE_FAKE_BFF"];
		delete process.env["VITE_BFF_URL"];
		try {
			await build({ mode: "production", logLevel: "silent" });
		} finally {
			restoreEnv("VITE_FAKE_BFF", savedFakeBff);
			restoreEnv("VITE_BFF_URL", savedBffUrl);
		}

		const assetFolder = "dist/assets";
		const scriptNames = (await readdir(assetFolder)).filter((name) => name.endsWith(".js"));
		const scripts = await Promise.all(
			scriptNames.map((name) => readFile(`${assetFolder}/${name}`, "utf8")),
		);
		const bundle = scripts.join("\n");
		expect(bundle).not.toContain("mockServiceWorker");
		expect(bundle).not.toContain("setupWorker");
	}, 60_000);
});

function restoreEnv(name: "VITE_FAKE_BFF" | "VITE_BFF_URL", value: string | undefined) {
	if (value !== undefined) {
		process.env[name] = value;
		return;
	}
	if (name === "VITE_FAKE_BFF") delete process.env["VITE_FAKE_BFF"];
	else delete process.env["VITE_BFF_URL"];
}
