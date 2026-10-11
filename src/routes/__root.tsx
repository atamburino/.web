import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppShell } from "@/app/AppShell";
import type { AppStore } from "@/app/store";

export const Route = createRootRouteWithContext<{ store: AppStore }>()({
	component: AppShell,
});
