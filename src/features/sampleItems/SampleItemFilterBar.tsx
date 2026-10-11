import { Input } from "@/shared/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { type SampleItemFilterProps, type StatusChoice, statusChoices } from "./search";

export function SampleItemFilterBar({ filters, onFiltersChange }: SampleItemFilterProps) {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Input
				aria-label="Search items"
				placeholder="Search items"
				className="max-w-xs"
				value={filters.nameContains}
				onChange={(event) => onFiltersChange({ ...filters, nameContains: event.target.value })}
			/>
			<ToggleGroup
				type="single"
				size="sm"
				variant="outline"
				aria-label="Status"
				value={filters.status}
				onValueChange={(value) => {
					const status = statusChoice(value);
					if (status === undefined) return;
					onFiltersChange({ ...filters, status });
				}}
			>
				{statusChoices.map((status) => (
					<ToggleGroupItem key={status} value={status}>
						{status}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}

function statusChoice(value: string): StatusChoice | undefined {
	return statusChoices.find((choice) => choice === value);
}
