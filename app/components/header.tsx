'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { toggleOverlay } from '~/lib/utils/toggle-overlay';
import { usePopup } from '~/lib/utils/toggle-popups';
import logo from '~/public/icons/logo.svg';
import { useUtilsContext } from '../context/utils-context';
import { IoMdClose, IoMdMenu } from 'react-icons/io';

const Header = () => {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);
	console.log('', isScrolled);
	const handleScrollBeyond = () => {
		const scrollTop = window.scrollY;
		const scrollThreshold = 500;

		if (scrollTop > scrollThreshold) {
			setIsScrolled(true);
		} else {
			setIsScrolled(false);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScrollBeyond);

		return () => {
			window.removeEventListener('scroll', handleScrollBeyond);
		};
	}, []);
	const handleScroll = useCallback(() => {
		setLastScrollY((prevLastScrollY) => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > prevLastScrollY) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			return currentScrollY;
		});
	}, []);
	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [lastScrollY, handleScroll]);

	const elementStyle = {
		transition: 'all 0.5s',
		transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
	};
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();
	const { overlayOpen, setOverlayOpen } = useUtilsContext();
	const handleToggleOverlay = () => {
		toggleOverlay();
		setOverlayOpen(!overlayOpen);
	};
	return (
		<nav
			className=" py-4  mx-auto w-full sticky top-0  bg-white  z-50 flex items-center justify-center px-16 max-xl:px-10 max-xs:px-5 max-2xl:py-2"
			style={elementStyle}
		>
			<div className="max-w-[1500px] flex items-center justify-between w-full">
				<Link href="/">
					<Image
						src={logo}
						alt="wefithost logo"
						className="w-[200px]  max-2xl:w-[140px]"
					/>
				</Link>

				<div className="flex items-center gap-5 text-[20px] font-light max-2xl:text-base  max-xs:text-sm max-2xs:hidden">
					<div className="relative">
						<button
							className="flex items-center gap-2 duration-150 link-style-dark"
							onClick={toggleDropdown}
						>
							<span>Topic</span>
							<FaAngleDown
								className={`duration-150 ${
									dropdownVisible ? 'rotate-180' : ''
								}`}
							/>
						</button>
						{dropdown && (
							<div
								className={`w-[200px]        py-4 px-2  flex flex-col       duration-300 absolute top-8 left-0    shadow-2xl  rounded-lg text-[16px] z-40 bg-white border-lightGrey border ${
									dropdownVisible ? 'opacity-100' : 'opacity-0'
								}`}
								ref={dropdownRef}
							>
								<Link
									href="/news"
									className="py-1.5 text-start px-2 hover:bg-[#f1f1f4] duration-150 "
								>
									WeFitHost News
								</Link>
								<Link
									href="/news"
									className="py-1.5 text-start px-2 hover:bg-[#f1f1f4] duration-150 "
								>
									Web hosting
								</Link>
								<Link
									href="/news"
									className="py-1.5 text-start px-2 hover:bg-[#f1f1f4] duration-150 "
								>
									Wordpress hosting
								</Link>
								<Link
									href="/news"
									className="py-1.5 text-start px-2 hover:bg-[#f1f1f4] duration-150 "
								>
									Agency
								</Link>
							</div>
						)}
					</div>

					<Link href="https://www.wefithost.com/" className="link-style-dark">
						Visit Wefithost
					</Link>
					<Link href="/contact" className="link-style-dark">
						Contact Us
					</Link>
				</div>
				<button
					className=" p-2  rounded-sm  hidden max-2xs:flex"
					onClick={handleToggleOverlay}
				>
					{overlayOpen ? (
						<IoMdClose className="text-2xl text-black " />
					) : (
						<IoMdMenu className="text-2xl text-black" />
					)}
				</button>
			</div>
		</nav>
	);
};

export default Header;

