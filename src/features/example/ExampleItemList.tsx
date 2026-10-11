import { describeApiError, type RequestState } from "@/shared/api";
import { FadeIn } from "@/shared/motion";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import type { ExampleItem } from "./model";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function ExampleItemList({ state }: { state: RequestState<ExampleItem[]> }) {
	switch (state.kind) {
		case "loading":
			return <Skeleton className="h-40 w-full" />;
		case "error":
			return (
				<Alert variant="destructive">
					<AlertTitle>Could not load items</AlertTitle>
					<AlertDescription>{describeApiError(state.error)}</AlertDescription>
				</Alert>
			);
		case "ready":
			return state.data.length === 0 ? (
				<p className="text-muted-foreground">No items match.</p>
			) : (
				<ul className="flex flex-col gap-2" aria-label="Items">
					{state.data.map((item, index) => (
						<li key={item.id}>
							<FadeIn index={index}>
								<ExampleItemRow item={item} />
							</FadeIn>
						</li>
					))}
				</ul>
			);
		default: {
			const _exhaustive: never = state;
			return _exhaustive;
		}
	}
}

function ExampleItemRow({ item }: { item: ExampleItem }) {
	return (
		<Card size="sm">
			<CardContent className="flex items-center justify-between gap-4">
				<span className="font-medium">{item.name}</span>
				<span className="flex items-center gap-3 text-sm text-muted-foreground">
					{dateFormat.format(item.createdAt)}
					<Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
				</span>
			</CardContent>
		</Card>
	);
}
