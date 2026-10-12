import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type AnimateUnlessReducedMotionProps = {
	children: ReactNode;
	fallback: ReactNode;
};

export function AnimateUnlessReducedMotion({
	children,
	fallback,
}: AnimateUnlessReducedMotionProps) {
	return usePrefersReducedMotion() ? fallback : children;
}
