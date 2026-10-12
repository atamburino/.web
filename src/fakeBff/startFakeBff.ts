import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const fakeBff = setupWorker(...handlers);

export async function startFakeBff() {
	await fakeBff.start({
		serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
		quiet: true,
	});
}
