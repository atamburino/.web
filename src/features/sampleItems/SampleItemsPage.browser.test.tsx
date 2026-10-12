import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { fakeBff } from "@/fakeBff/startFakeBff";
import { renderApp } from "../../../test/renderApp";

describe("index route", () => {
	it("lists items from the fake BFF", async () => {
		const { screen } = await renderApp("/");
		await expect.element(screen.getByText("Validate responses with zod")).toBeVisible();
		await expect.element(screen.getByText("Hand-written fetch wrappers")).toBeVisible();
	});

	it("filters by status from the URL", async () => {
		const { screen } = await renderApp("/?status=archived");
		await expect.element(screen.getByText("Hand-written fetch wrappers")).toBeVisible();
		await expect.element(screen.getByText("Validate responses with zod")).not.toBeInTheDocument();
	});

	it("falls back to defaults for an invalid search param", async () => {
		const { router } = await renderApp("/?status=bogus");
		expect(router.state.location.search).toEqual({ nameContains: "", status: "all" });
	});

	it("writes the search box into the URL", async () => {
		const { screen, router } = await renderApp("/");
		await screen.getByRole("textbox", { name: "Search items" }).fill("zod");
		await expect.element(screen.getByText("Hand-written fetch wrappers")).not.toBeInTheDocument();
		expect(router.state.location.search).toEqual({ nameContains: "zod", status: "all" });
	});

	it("shows a validation error when the BFF breaks the contract", async () => {
		fakeBff.use(
			http.get("*/api/template-sample/items", () => HttpResponse.json([{ id: 1, name: null }])),
		);
		const { screen } = await renderApp("/");
		await expect.element(screen.getByText(/unexpected shape/)).toBeVisible();
	});
});
