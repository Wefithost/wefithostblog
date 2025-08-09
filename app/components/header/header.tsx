'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { toggleOverlay } from '~/utils/toggle-overlay';
import { usePopup } from '~/utils/toggle-popups';
import logo from '~/public/icons/logo.svg';
import { useUtilsContext } from '../../context/utils-context';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { motion } from 'motion/react';
import { useAuthContext } from '../../context/auth-context';
import ProfileDropdown from './profile-dropdown';
const Header = () => {
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();
	const {
		isActive: profileDropdown,
		isVisible: profileDropdownVisible,
		togglePopup: toggleProfileDropdown,
		ref: profileDropdownRef,
	} = usePopup();

	const { overlayOpen, setOverlayOpen, toggleAuthPopup, setCurrentAction } =
		useUtilsContext();

	const { user } = useAuthContext();
	const handleToggleOverlay = () => {
		toggleOverlay();
		setOverlayOpen(!overlayOpen);
	};
	return (
		<header className=" py-4  mx-auto w-full sticky top-0  bg-white  z-50 flex items-center justify-center px-16 max-xl:px-10 max-xs:px-5 max-2xl:py-2">
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
					{user ? (
						<div className="relative">
							<div
								className="text-sm  flex gap-2 items-center  py-1 px-2 rounded-full bg-lightGrey  cursor-pointer border-purple-100 border hover:bg-grey-"
								onClick={toggleProfileDropdown}
							>
								{/* eslint-disable-next-line */}
								<img
									src={user?.profile ? user.profile : '/icons/default-user.svg'}
									className="w-6 h-6 object-cover rounded-full "
									alt=""
									width={24}
									height={24}
								/>
								<h1 className="text-black  max-2xl:text-base  max-xs:text-sm text-base leading-0">
									{user?.first_name ?? user?.email}
								</h1>
								<FaAngleDown
									className={`duration-150 text-black text-base font-light  ${
										profileDropdownVisible ? 'rotate-180' : ''
									}`}
								/>
							</div>
							<ProfileDropdown
								profileDropdown={profileDropdown}
								profileDropdownRef={profileDropdownRef}
								profileDropdownVisible={profileDropdownVisible}
								toggleProfileDropdown={toggleProfileDropdown}
							/>
						</div>
					) : (
						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={() => {
								toggleAuthPopup();
								setCurrentAction('log-in');
							}}
							className=" h-[45px] text-center bg-purple text-white text-[20px] rounded-sm px-5 duration-150 hover:bg-darkPurple"
						>
							Sign In
						</motion.button>
					)}
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
		</header>
	);
};

export default Header;

