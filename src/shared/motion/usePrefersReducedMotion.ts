import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
	return useMediaQuery(reducedMotionQuery);
}
