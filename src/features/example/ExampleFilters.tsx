import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { type ExampleSearch, exampleStatusFilters } from "./search";

type ExampleFiltersProps = {
	search: ExampleSearch;
	onSearchChange: (next: ExampleSearch) => void;
};

export function ExampleFilters({ search, onSearchChange }: ExampleFiltersProps) {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Input
				aria-label="Search items"
				placeholder="Search items"
				className="max-w-xs"
				value={search.q}
				onChange={(event) => onSearchChange({ ...search, q: event.target.value })}
			/>
			<div className="flex gap-1" role="group" aria-label="Status">
				{exampleStatusFilters.map((status) => (
					<Button
						key={status}
						size="sm"
						variant={search.status === status ? "default" : "outline"}
						aria-pressed={search.status === status}
						onClick={() => onSearchChange({ ...search, status })}
					>
						{status}
					</Button>
				))}
			</div>
		</div>
	);
}
