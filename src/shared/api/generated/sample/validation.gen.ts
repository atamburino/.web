import { api } from "./endpoints.gen";
import { zGetTemplateSampleItemsResponse } from "./zod.gen";

export const validatedApi = api.enhanceEndpoints({
	endpoints: {
		getTemplateSampleItems: { responseSchema: zGetTemplateSampleItemsResponse },
	},
});
