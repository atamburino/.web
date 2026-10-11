import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onChange: () => void) {
	const mediaQueryList = matchMedia(query);
	mediaQueryList.addEventListener("change", onChange);
	return () => mediaQueryList.removeEventListener("change", onChange);
}

export function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(
		(onChange) => subscribeToMediaQuery(query, onChange),
		() => matchMedia(query).matches,
	);
}
