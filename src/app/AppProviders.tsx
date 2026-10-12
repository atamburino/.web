import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { MotionConfig } from "@/shared/motion";
import { ThemeProvider } from "@/shared/theme";
import type { createAppRouter } from "./router";
import type { AppStore } from "./store";

type AppProvidersProps = {
	store: AppStore;
	router: ReturnType<typeof createAppRouter>;
};

export function AppProviders({ store, router }: AppProvidersProps) {
	return (
		<Provider store={store}>
			<ThemeProvider>
				<MotionConfig reducedMotion="user">
					<RouterProvider router={router} />
				</MotionConfig>
			</ThemeProvider>
		</Provider>
	);
}
