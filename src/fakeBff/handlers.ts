import { HttpResponse, http } from "msw";
import { sampleItems } from "./fixtures";

export const handlers = [
	http.get("*/api/template-sample/items", ({ request }) => {
		const search = new URL(request.url).searchParams.get("search")?.toLowerCase() ?? "";
		return HttpResponse.json(
			sampleItems.filter((item) => item.name.toLowerCase().includes(search)),
		);
	}),
];
