import { BlurInText } from "@/shared/motion";
import { useSampleItems } from "./api";
import { SampleItemFilterBar } from "./SampleItemFilterBar";
import { SampleItemList } from "./SampleItemList";
import type { SampleItemFilterProps } from "./search";

export function SampleItemsPage({ filters, onFiltersChange }: SampleItemFilterProps) {
	const itemsRequest = useSampleItems(filters);
	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-2">
				<div role="heading" aria-level={1}>
					<BlurInText text="Reference feature" className="text-3xl font-semibold" />
				</div>
				<p className="max-w-2xl text-muted-foreground">
					Generated hook, zod-validated response, route-parsed search params. Copy this folder with{" "}
					<code className="font-mono text-sm">pnpm new:feature</code>.
				</p>
			</header>
			<SampleItemFilterBar filters={filters} onFiltersChange={onFiltersChange} />
			<SampleItemList itemsRequest={itemsRequest} />
		</div>
	);
}
