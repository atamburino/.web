import "@/shared/styles/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./AppProviders";
import { createAppRouter } from "./router";
import { createAppStore } from "./store";

async function startApp() {
	// Compare the flag in this file. Vite only drops the import when the check is written here.
	if (import.meta.env.VITE_FAKE_BFF === "true") {
		const { startFakeBff } = await import("@/fakeBff/startFakeBff");
		await startFakeBff();
	}
	const rootElement = document.getElementById("root");
	if (rootElement === null) throw new Error("Missing #root element");
	const store = createAppStore();
	createRoot(rootElement).render(
		<StrictMode>
			<AppProviders store={store} router={createAppRouter({ store })} />
		</StrictMode>,
	);
}

void startApp();
