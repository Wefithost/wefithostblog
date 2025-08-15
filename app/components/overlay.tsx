'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUtilsContext } from '~/app/context/utils-context';
import Link from 'next/link';
import { Accordion } from './accordion';

const Overlay = () => {
	const { setOverlayOpen } = useUtilsContext();

	const linkname = usePathname();
	useEffect(() => {
		const overlayElement = document.getElementById('overlay');

		if (!overlayElement) {
			return;
		}
		overlayElement.style.transform = 'translateY(-100%)';

		setOverlayOpen(false);
	}, [linkname, setOverlayOpen]);

	const footerLink = [
		{
			header: 'Topics',
			link: [
				{
					dir: 'WeFitHost News',
					href: '/',
				},
				{
					dir: 'Web Hosting',
					href: '/',
				},
				{
					dir: 'Wordpress hosting',
					href: '/',
				},
				{
					dir: 'Agency',
					href: '/',
				},
			],
		},
	];
	return (
		<div
			className=" hidden w-full  fixed z-40 top-0 right-0 bg-white  max-md:flex      flex-col gap-16 justify-end   ease-out duration-[0.4s]  h-full text-[#000]  "
			id="overlay"
		>
			<div className=" w-full  py-4   h-full mt-[57px]     flex flex-col  overflow-auto  gap-2 ">
				<Accordion
					links={footerLink}
					accordion_class_override="!text-black !text-base !border-lightGrey !px-5"
					arrow_class_override="!border-black"
				/>

				<Link
					href="/contact"
					className="text-base uppercase py-4 px-6 border-b border-lightGrey"
				>
					Contact us
				</Link>
				<Link
					href="https://www.wefithost.com/"
					className="text-base uppercase py-4 px-6 border-b border-lightGrey"
				>
					Visit WeFitHost
				</Link>
			</div>
		</div>
	);
};

export default Overlay;

