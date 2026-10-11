import { createApi, type FetchBaseQueryError, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/shared/config/env";

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: env.VITE_BFF_URL }),
	catchSchemaFailure: (error, info): FetchBaseQueryError => ({
		status: "CUSTOM_ERROR",
		error: `${info.endpoint} failed ${error.schemaName}`,
		data: error.issues,
	}),
	endpoints: () => ({}),
});
