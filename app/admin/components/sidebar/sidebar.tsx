import Image from 'next/image';
import logo from '~/public/icons/logo.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarList from './projects-list-card';
import { MdApps, MdArticle } from 'react-icons/md';
interface SidebarProps {
	hidden: string;
}
const Sidebar = ({ hidden }: SidebarProps) => {
	const linkname = usePathname();
	const menuList = [
		{
			id: 1,
			dir: 'Products',
			href: '/admin/products',
			icon: <MdArticle className="text-black" />,
			activeIcon: <MdArticle className="text-purple" />,
		},
		{
			id: 2,
			dir: 'Users',
			href: '/admin/users',
			icon: <MdArticle className="text-black" />,
			activeIcon: <MdArticle className="text-black" />,
		},
		{
			id: 3,
			dir: 'Transactions',
			href: '/admin/transactions',
			icon: <MdArticle className="text-black" />,
			activeIcon: <MdArticle className="text-black" />,
		},
	];
	return (
		<section
			className={`h-full w-[260px]  pt-6 pb-5 flex flex-col gap-10  items-start shrink-0   xl:pt-5 xl:px-2  bg-white lg:w-[260px] lg:px-0     ${
				hidden && 'lg:hidden'
			}`}
		>
			<div className="flex  items-center justify-center   w-full flex-col">
				<Link href={'/'}>
					<Image
						src={logo}
						alt=""
						className="w-[160px] xl:w-[120px] shrink-0"
						priority
					/>
				</Link>
				<h1 className="text-xs text-grey neue  ">Admin Dashboard</h1>
			</div>
			<div className="flex flex-col  w-full  gap-3">
				<h1 className="text-grey text-xs pl-5">MAIN MENU</h1>
				<div className="h-full  w-full flex flex-col gap-1">
					<Link
						href={'/admin'}
						className={`   py-3 px-5 text-[20px] neue  flex items-center  gap-3  w-full xl:text-xl text-grey relative duration-150      ${
							linkname === '/admin' && ' bg-dimGreen  text-softGreen  '
						}`}
					>
						{linkname === '/admin' ? (
							<MdApps className="text-purple" />
						) : (
							<MdApps className="text-purple" />
						)}

						{linkname === '/admin' && (
							<div className="absolute right-0 bg-purple h-full p-1"></div>
						)}
						<span>Overview</span>
					</Link>
					{menuList?.map((data) => (
						<SidebarList key={data.id} {...data} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Sidebar;

