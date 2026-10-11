import { type RequestState, toRequestState } from "@/shared/api";
import { sampleApi, useGetTemplateSampleItemsQuery } from "@/shared/api/generated/sample";
import { type SampleItem, filterByStatus, toSampleItem } from "./model";
import type { SampleItemFilters } from "./search";

const filtersToRequestParams = ({ nameContains }: SampleItemFilters) =>
	nameContains === "" ? {} : { search: nameContains };

export function prefetchSampleItems(filters: SampleItemFilters) {
	return sampleApi.util.prefetch("getTemplateSampleItems", filtersToRequestParams(filters), {});
}

export function useSampleItems(filters: SampleItemFilters): RequestState<SampleItem[]> {
	const { data, error } = useGetTemplateSampleItemsQuery(filtersToRequestParams(filters));
	const items = data?.map(toSampleItem);
	return toRequestState({
		data: items === undefined ? undefined : filterByStatus({ items, status: filters.status }),
		error,
	});
}
