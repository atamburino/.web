import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type ApiError =
	| { kind: "network"; message: string }
	| { kind: "http"; status: number; body: unknown }
	| { kind: "validation"; message: string; issues: unknown };

export function toApiError(error: FetchBaseQueryError | SerializedError): ApiError {
	if (!("status" in error)) {
		return { kind: "network", message: error.message ?? "Unknown error" };
	}
	switch (error.status) {
		case "FETCH_ERROR":
		case "TIMEOUT_ERROR":
		case "PARSING_ERROR":
			return { kind: "network", message: error.error };
		case "CUSTOM_ERROR":
			return { kind: "validation", message: error.error, issues: error.data };
		default:
			return { kind: "http", status: error.status, body: error.data };
	}
}

export function describeApiError(error: ApiError): string {
	switch (error.kind) {
		case "network":
			return `Could not reach the server. ${error.message}`;
		case "http":
			return `The server answered ${String(error.status)}.`;
		case "validation":
			return `The server sent data in an unexpected shape. ${error.message}`;
		default: {
			const _exhaustive: never = error;
			return _exhaustive;
		}
	}
}
