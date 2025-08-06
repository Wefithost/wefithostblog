import Link from 'next/link';
import { useEffect } from 'react';

import { useState } from 'react';

import { useRef } from 'react';

interface AccordionItemProps {
	isOpen: boolean;
	onClick: () => void;
	// eslint-disable-next-line
	[key: string]: any;
	features: {
		dir: string;
		href: string;
	}[];
}
const AccordionItem: React.FC<AccordionItemProps> = ({
	isOpen,
	onClick,
	features,
	...props
}) => {
	const contentHeight = useRef<HTMLDivElement | null>(null);

	const [height, setHeight] = useState('0px');
	useEffect(() => {
		if (isOpen && contentHeight.current) {
			setHeight(`${contentHeight.current.scrollHeight}px`);
		} else {
			setHeight('0px');
		}
	}, [isOpen]);
	return (
		<div className=" overflow-hidden   w-full flex flex-col    text-white  border-b  border-[#ffffffa7]   px-2 ">
			<button
				className={`w-full  py-6   flex items-center justify-between  border-none pointer leading-none   flex-nowrap  max-md:py-5 `}
				onClick={onClick}
			>
				<p className="text-xs neue-thin uppercase neue-light ">
					{props.header}
				</p>
				<span
					className={`p-1   border-b-[1px] border-r-[1px]   border-[#fff] duration-300   ${
						isOpen ? 'rotate-[45deg]' : 'rotate-[315deg]'
					}`}
				></span>
			</button>
			<div
				ref={contentHeight}
				className="ease-out duration-300"
				style={{ height }}
			>
				<div className="flex flex-col  py-2 ">
					{features.map((data) => (
						<Link
							href={data.href}
							className="leading-none  py-3 rounded-md shrink-0 max-xs:py-2 ease-out duration-100"
							key={data.dir}
						>
							<p className="   text-sm neue-light text-dimGrey  hover:text-darkGrey capitalize ">
								{data.dir}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};
interface Links {
	header: string;
	link: {
		dir: string;
		href: string;
	}[];
}
interface AccordionProps {
	links: Links[];
}
export const Accordion = ({ links }: AccordionProps) => {
	const [activeIndices, setActiveIndices] = useState<number[]>([]);

	const handleItemClick = (index: number) => {
		setActiveIndices((prevIndices) =>
			prevIndices.includes(index)
				? prevIndices.filter((i) => i !== index)
				: [...prevIndices, index],
		);
	};

	return (
		<div className="w-full max-lg:flex max-lg:flex-col  hidden ">
			{links.map((item, index) => (
				<AccordionItem
					key={item?.header}
					{...item}
					isOpen={activeIndices.includes(index)}
					onClick={() => handleItemClick(index)}
					features={item.link}
				/>
			))}
		</div>
	);
};

