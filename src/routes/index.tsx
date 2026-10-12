import { createFileRoute } from "@tanstack/react-router";
import {
	prefetchSampleItems,
	SampleItemsPage,
	sampleItemFiltersSchema,
} from "@/features/sampleItems";

export const Route = createFileRoute("/")({
	validateSearch: sampleItemFiltersSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => context.store.dispatch(prefetchSampleItems(deps)),
	component: IndexRoutePage,
});

function IndexRoutePage() {
	const filters = Route.useSearch();
	const navigate = Route.useNavigate();
	return (
		<SampleItemsPage
			filters={filters}
			onFiltersChange={(next) => void navigate({ search: next, replace: true })}
		/>
	);
}
