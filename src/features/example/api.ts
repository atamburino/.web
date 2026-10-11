import { type RequestState, toRequestState } from "@/shared/api";
import { api, useGetTemplateSampleItemsQuery } from "@/shared/api/generated/sample";
import { type ExampleItem, filterByStatus, toExampleItem } from "./model";
import type { ExampleSearch } from "./search";

const toQueryArg = ({ q }: ExampleSearch) => (q === "" ? {} : { search: q });

export function prefetchExampleItems(search: ExampleSearch) {
	return api.util.prefetch("getTemplateSampleItems", toQueryArg(search), {});
}

export function useExampleItems(search: ExampleSearch): RequestState<ExampleItem[]> {
	const { data, error } = useGetTemplateSampleItemsQuery(toQueryArg(search));
	const items = data?.map(toExampleItem);
	return toRequestState({
		data: items === undefined ? undefined : filterByStatus({ items, status: search.status }),
		error,
	});
}
