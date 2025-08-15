import ProfileDropdown from '~/app/components/header/profile-dropdown';

const Header = () => {
	return (
		<header className="py-4  mx-auto w-full  bg-white  z-50 flex items-center justify-end px-4 max-xl:px-10 max-xs:px-5 max-2xl:py-2">
			<ProfileDropdown />
		</header>
	);
};

export default Header;

