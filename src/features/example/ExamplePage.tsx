import { BlurHeading } from "@/shared/motion";
import { useExampleItems } from "./api";
import { ExampleFilters } from "./ExampleFilters";
import { ExampleItemList } from "./ExampleItemList";
import type { ExampleSearch } from "./search";

type ExamplePageProps = {
	search: ExampleSearch;
	onSearchChange: (next: ExampleSearch) => void;
};

export function ExamplePage({ search, onSearchChange }: ExamplePageProps) {
	const items = useExampleItems(search);
	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-2">
				<div role="heading" aria-level={1}>
					<BlurHeading text="Reference feature" className="text-3xl font-semibold" />
				</div>
				<p className="max-w-2xl text-muted-foreground">
					Generated hook, zod-validated response, route-parsed search params. Copy this folder with{" "}
					<code className="font-mono text-sm">pnpm new:feature</code>.
				</p>
			</header>
			<ExampleFilters search={search} onSearchChange={onSearchChange} />
			<ExampleItemList state={items} />
		</div>
	);
}
