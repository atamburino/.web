import { describe, expect, it } from "vitest";
import { describeApiError, toApiError } from "./apiError";
import { toRequestState } from "./requestState";

describe("toApiError", () => {
	it("maps schema failures to validation errors", () => {
		const error = toApiError({ status: "CUSTOM_ERROR", error: "bad shape", data: [] });
		expect(error.kind).toBe("validation");
	});

	it("maps numeric statuses to http errors", () => {
		expect(toApiError({ status: 503, data: null })).toEqual({
			kind: "http",
			status: 503,
			body: null,
		});
	});

	it("describes every kind", () => {
		expect(describeApiError({ kind: "http", status: 404, body: null })).toContain("404");
	});
});

describe("toRequestState", () => {
	it("prefers the error over stale data", () => {
		const state = toRequestState({ data: [1], error: { status: 500, data: null } });
		expect(state.kind).toBe("error");
	});

	it("is loading with neither data nor error", () => {
		expect(toRequestState({}).kind).toBe("loading");
	});
});
