import { createFileRoute } from "@tanstack/react-router";
import { ExamplePage, exampleSearchSchema, prefetchExampleItems } from "@/features/example";

export const Route = createFileRoute("/")({
	validateSearch: exampleSearchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => context.store.dispatch(prefetchExampleItems(deps)),
	component: ExampleRoute,
});

function ExampleRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	return (
		<ExamplePage
			search={search}
			onSearchChange={(next) => void navigate({ search: next, replace: true })}
		/>
	);
}
