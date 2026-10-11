import { createBrowserHistory, createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import type { AppStore } from "./store";

type CreateAppRouterArgs = { store: AppStore; history?: RouterHistory };

export function createAppRouter({ store, history = createBrowserHistory() }: CreateAppRouterArgs) {
	return createRouter({ routeTree, history, context: { store }, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createAppRouter>;
	}
}
