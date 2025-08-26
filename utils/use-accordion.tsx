import { useRef, useState, useEffect } from 'react';

export function useAccordion(isOpen: boolean) {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const [height, setHeight] = useState('0px');

	useEffect(() => {
		if (isOpen && contentRef.current) {
			setHeight(`${contentRef.current.scrollHeight}px`);
		} else {
			setHeight('0px');
		}
	}, [isOpen]);

	return { contentRef, height };
}

