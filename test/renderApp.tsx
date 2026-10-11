import { createMemoryHistory } from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { AppProviders } from "@/app/AppProviders";
import { createAppRouter } from "@/app/router";
import { createAppStore } from "@/app/store";

export async function renderApp(path: string) {
	const store = createAppStore();
	const router = createAppRouter({
		store,
		history: createMemoryHistory({ initialEntries: [path] }),
	});
	const screen = await render(<AppProviders store={store} router={router} />);
	return { screen, router };
}
