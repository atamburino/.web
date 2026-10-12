import { AnimateUnlessReducedMotion } from "./AnimateUnlessReducedMotion";
import BlurText from "./reactBits/BlurText";

type BlurInTextProps = {
	text: string;
	className?: string;
};

export function BlurInText({ text, className }: BlurInTextProps) {
	return (
		<AnimateUnlessReducedMotion fallback={<p className={className}>{text}</p>}>
			<BlurText text={text} delay={80} animateBy="words" className={className ?? ""} />
		</AnimateUnlessReducedMotion>
	);
}
