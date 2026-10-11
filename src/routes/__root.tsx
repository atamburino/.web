import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppLayout } from "@/app/AppLayout";
import type { AppStore } from "@/app/store";

export const Route = createRootRouteWithContext<{ store: AppStore }>()({
	component: AppLayout,
});
