import { motion } from "motion/react";
import type { ReactNode } from "react";

type FadeInProps = {
	children: ReactNode;
	index?: number;
};

export function FadeIn({ children, index = 0 }: FadeInProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay: index * 0.04 }}
		>
			{children}
		</motion.div>
	);
}
