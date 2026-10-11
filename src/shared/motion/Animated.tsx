import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type AnimatedProps = {
	children: ReactNode;
	fallback: ReactNode;
};

export function Animated({ children, fallback }: AnimatedProps) {
	return usePrefersReducedMotion() ? fallback : children;
}
