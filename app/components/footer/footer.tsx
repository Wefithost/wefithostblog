'use client';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { Accordion } from '../accordion';
import logo from '~/public/icons/logo.svg';
import { FaFacebook, FaInstagram, FaSlack, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
	const mediaLink = [
		{
			icon: <FaFacebook />,
			href: 'https://www.facebook.com/share/15kgJ8pdVq/?mibextid=wwXIfr',
			id: 1,
		},
		{
			icon: <FaInstagram />,
			href: 'https://www.instagram.com/wefithost_official/',
			id: 2,
		},
		{
			icon: <FaYoutube />,
			href: 'https://www.youtube.com/channel/UCs-G2Y6VH16oYk-aan1EX8A',
			id: 3,
		},
		{
			icon: <FaSlack />,
			href: 'http://wefithost.slack.com',
			id: 4,
		},
	];
	const footerLink = [
		{
			header: 'Services',
			link: [
				{
					dir: 'Web hosting ',
					href: 'https://wefithost.com/web',
				},
				{
					dir: 'Domain transfer',
					href: 'https://wefithost.com/domain-transfer',
				},
				{
					dir: 'Cloud hosting',
					href: 'https://wefithost.com/cloud-hosting',
				},
				{
					dir: 'Professional email',
					href: 'https://wefithost.com/email',
				},
				{
					dir: 'SSL certificates',
					href: 'https://wefithost.com/ssl-certificate',
				},
				{
					dir: 'Wordpress Hosting',
					href: 'https://wefithost.com/wordpress-hosting',
				},
			],
		},
		{
			header: 'Support',
			link: [
				{
					dir: 'contact us',
					href: 'https://wefithost.com/contact-us',
				},
				{
					dir: 'agency',
					href: 'https://wefithost.com/agency',
				},
				// {
				// 	dir: 'system status',
				// 	href: '/',
				// },
				{
					dir: 'free migration',
					href: 'https://wefithost.com/free-migration',
				},

				{
					dir: 'Digital marketing',
					href: 'https://wefithost.com/digital-marketing',
				},
			],
		},
		{
			header: 'Company',
			link: [
				{
					dir: 'About us',
					href: 'https://wefithost.com/about',
				},
				{
					dir: 'Customer reviews',
					href: 'https://wefithost.com/reviews',
				},
				{
					dir: 'Careers',
					href: 'https://wefithost.com/careers',
				},
				// {
				// 	dir: 'Affiliates',
				// 	href: '/',
				// },
			],
		},
	];
	const linkname = usePathname();
	return (
		<footer
			className={`bg-deepPurple flex flex-col w-full  text-darkGrey ${
				linkname.startsWith('/admin') && 'hidden'
			}`}
		>
			<div className="flex item   max-2xl:px-10 max-xs:px-5 max-lg:flex-col max-sm:px-5 justify-between max-w-[1500px] mx-auto w-full">
				<div className=" py-12   text-white shrink-0 flex flex-col max-xl:px-3 max-lg:border-none   max-sm:px-0">
					<div className=" flex flex-col gap-6 max-w-[500px]">
						<div className="flex  flex-col gap-3">
							<Image src={logo} className="invert" alt="" />
							<p className="text-lg ">
								Reliable web hosting, domains, cloud solutions, and professional
								email services for businesses of all sizes.
							</p>
						</div>
						<div className="flex  items-center gap-4">
							{mediaLink.map((media) => (
								<Link
									key={media.id}
									href={media.href}
									className="text-2xl link-style"
								>
									{media.icon}
								</Link>
							))}
						</div>
					</div>
				</div>
				<div className=" grid grid-cols-3   w-[800px]   py-12 max-lg:hidden">
					{footerLink.map((data) => (
						<div className="flex   gap-4  flex-col " key={data.header}>
							<h4 className=" text-[18px] font-semibold text-white">
								{data.header}
							</h4>
							<div className="flex gap-2 flex-col text-[20px] font-semibold items-start">
								{data.link.map((li) => (
									<Link
										href={li.href}
										className="      text-white text-base font-light capitalize link-style"
										key={li.dir}
									>
										{li.dir}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
				<Accordion links={footerLink} />
			</div>
			<div className="flex   w-full py-10  px-20 items-center justify-between text-[10px]  text-dimGrey  capitalize max-sm:px-5 flex-wrap max-w-[1500px] mx-auto gap-5 ">
				<div className="flex gap-3 items-center  text-white">
					<span className=" text-sm font-light">
						© {new Date().getFullYear()} Wefithost. All rights reserved
					</span>
				</div>
				<div className="flex gap-4 items-center  text-white">
					<Link
						href={'https://wefithost.com/privacy-policy'}
						className=" text-sm font-light link-style"
					>
						Privacy policy
					</Link>
					<Link
						href={'https://wefithost.com/terms'}
						className=" text-sm font-light link-style"
					>
						Terms of service
					</Link>
					<Link
						href={'https://wefithost.com/acceptable-policy'}
						className=" text-sm font-light link-style"
					>
						Acceptable Use
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

