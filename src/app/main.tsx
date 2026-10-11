import "@/shared/styles/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./Providers";
import { createAppRouter } from "./router";
import { createAppStore } from "./store";

async function start() {
	if (import.meta.env.VITE_FAKE_BFF === "true") {
		const { startFakeBff } = await import("@/fakeBff/browser");
		await startFakeBff();
	}
	const root = document.getElementById("root");
	if (root === null) throw new Error("Missing #root element");
	const store = createAppStore();
	createRoot(root).render(
		<StrictMode>
			<Providers store={store} router={createAppRouter({ store })} />
		</StrictMode>,
	);
}

void start();
