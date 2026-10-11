import { Animated } from "./Animated";
import BlurText from "./bits/BlurText";

type BlurHeadingProps = {
	text: string;
	className?: string;
};

export function BlurHeading({ text, className }: BlurHeadingProps) {
	return (
		<Animated fallback={<p className={className}>{text}</p>}>
			<BlurText text={text} delay={80} animateBy="words" className={className ?? ""} />
		</Animated>
	);
}
