import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type ApiError, toApiError } from "./apiError";

export type RequestState<T> =
	{ kind: "loading" } | { kind: "error"; error: ApiError } | { kind: "ready"; data: T };

type QueryResult<T> = {
	data?: T | undefined;
	error?: FetchBaseQueryError | SerializedError | undefined;
};

export function toRequestState<T>({ data, error }: QueryResult<T>): RequestState<T> {
	if (error !== undefined) return { kind: "error", error: toApiError(error) };
	if (data !== undefined) return { kind: "ready", data };
	return { kind: "loading" };
}
