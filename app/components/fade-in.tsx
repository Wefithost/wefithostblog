import { useAnimation, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';
import * as motion from 'motion/react-client';
export const Fade = ({ children }: { children: React.ReactNode }) => {
	const controls = useAnimation();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });
	useEffect(() => {
		if (isInView) {
			controls.start('visible');
		}
	}, [controls, isInView]);

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			style={{ display: 'contents' }}
			animate={controls}
			variants={{
				hidden: { opacity: 0, y: 40 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: 3, ease: 'easeOut' },
				},
			}}
		>
			{children}
		</motion.div>
	);
};

