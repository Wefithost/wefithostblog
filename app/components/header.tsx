'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { usePopup } from '~/lib/utils/toggle-popups';
import logo from '~/public/icons/logo.svg';

const Header = () => {
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();
	return (
		<nav className="flex items-center justify-between py-4">
			<Link href="/">
				<Image src={logo} alt="wefithost logo" className="w-[200px] " />
			</Link>
			<div className="flex items-center gap-5 text-[20px] font-light">
				<div className="relative">
					<button
						className="flex items-center gap-2 duration-150"
						onClick={toggleDropdown}
					>
						<span>Topic</span>
						<FaAngleDown
							className={`duration-150 ${dropdownVisible ? 'rotate-180' : ''}`}
						/>
					</button>
					{dropdown && (
						<div
							className={`w-[200px]        py-4 px-2  flex flex-col       duration-300 absolute top-8 left-0    shadow-2xl  rounded-lg text-[16px]  ${
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

				<Link href="https://www.wefithost.com/">Visit Wefithost</Link>
				<Link href="/contact">Contact Us</Link>
			</div>
		</nav>
	);
};

export default Header;

