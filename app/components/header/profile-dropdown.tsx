import { CiLogout } from 'react-icons/ci';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useAuthContext } from '~/app/context/auth-context';
import { formatDate } from '~/utils/format-date';
import { usePopup } from '~/utils/toggle-popups';
import LogoutPrompt from './logout-prompt';
import EditName from './edit-name-prompt';
import EditProfile from './edit-profile';
import { useUtilsContext } from '~/app/context/utils-context';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import UpdateBioPrompt from './update-bio-prompt';

const ProfileDropdown = () => {
	const { user } = useAuthContext();
	const { toggleAuthPopup, setResetPassword, setCurrentAction } =
		useUtilsContext();
	const {
		isActive: logoutPrompt,
		isVisible: logoutPromptVisible,
		togglePopup: toggleLogoutPrompt,
		ref: logoutPromptRef,
	} = usePopup();
	const {
		isActive: changeNamePrompt,
		isVisible: changeNamePromptVisible,
		togglePopup: toggleChangeNamePrompt,
		ref: changeNamePromptRef,
		setDisableToggle: disableChangeNamePrompt,
	} = usePopup();
	const {
		isActive: changeProfilePrompt,
		isVisible: changeProfilePromptVisible,
		togglePopup: toggleChangeProfilePrompt,
		ref: changeProfilePromptRef,
		setDisableToggle: disableChangeProfilePrompt,
	} = usePopup();
	const {
		isActive: profileDropdown,
		isVisible: profileDropdownVisible,
		togglePopup: toggleProfileDropdown,
		ref: profileDropdownRef,
	} = usePopup();
	const {
		isActive: changeBioPrompt,
		isVisible: changeBioPromptVisible,
		togglePopup: toggleChangeBioPrompt,
		ref: changeBioPromptRef,
		setDisableToggle: disableChangeBioPrompt,
	} = usePopup();
	return (
		<>
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
				{profileDropdown && (
					<div
						className={`w-[400px]  border border-gray-200   rounded-lg  py-4 px-6  flex flex-col gap-4  bg-lightGrey    shadow-lg duration-300 absolute top-10 right-0    max-lg:left-1/2  lg:transform   max-lg:-translate-x-1/2  font-normal ${
							profileDropdownVisible ? 'opacity-100' : 'opacity-0'
						}`}
						ref={profileDropdownRef}
					>
						<h1 className="text-xl  text-black ">Your account</h1>
						<div className="flex flex-col w-full gap-1">
							<div className="flex  items-center gap-3 py-2 px-3   bg-white rounded-lg  border-gray-400 ">
								{/* eslint-disable-next-line */}
								<img
									src={user?.profile ? user.profile : '/icons/default-user.svg'}
									className="w-10  h-10 object-cover rounded-full cursor-pointer "
									onClick={toggleChangeProfilePrompt}
									alt=""
								/>
								<div className="flex flex-col items-start line-clamp-1 ">
									<h1 className="text-[16px] leading-[24px] line-clamp-1 text-black">
										{user?.first_name} {user?.last_name}
									</h1>
									{user?.first_name && (
										<h1 className="text-sm leading-[20px]text-black">
											{user?.email}
										</h1>
									)}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<h1 className="text-sm text-[#8D8896] py-1 px-3 ">
									joined{' '}
									<span className=" text-black">
										{formatDate(user?.createdAt as string)}
									</span>
								</h1>
								<Link
									href="/admin"
									className="ext-xs  bg-[#FFFBDB] neue-light px-2 border border-[#a37a00]   rounded-full text-[#a37a00] text-xs "
								>
									{user?.role}
								</Link>
							</div>
							<div className="w-full flex flex-col gap-2 ">
								<button
									className="flex items-center bg-white justify-between p-3 rounded-lg outline-none duration-150  hover:bg-purple-50"
									onClick={toggleChangeNamePrompt}
								>
									<h1 className="text-sm">
										{user?.first_name ? 'Change name' : 'Enter your name'}
									</h1>
									<MdOutlineKeyboardArrowRight className="text-sm " />
								</button>
								<button
									className="flex items-center bg-white justify-between p-3 rounded-lg outline-none  hover:bg-purple-50  duration-150    "
									onClick={toggleChangeProfilePrompt}
								>
									<h1 className="text-sm">Change profile</h1>
									<MdOutlineKeyboardArrowRight className="text-sm " />
								</button>
								{user?.role !== 'member' && (
									<button
										className="flex items-center bg-white justify-between p-3 rounded-lg outline-none  hover:bg-purple-50  duration-150  "
										onClick={() => {
											toggleChangeBioPrompt();
										}}
									>
										<h1 className="text-sm">
											{' '}
											{user?.bio ? 'Edit bio' : 'Add a bio'}
										</h1>
										<MdOutlineKeyboardArrowRight className="text-sm " />
									</button>
								)}

								<button
									className="flex items-center bg-white justify-between p-3 rounded-lg outline-none  hover:bg-purple-50  duration-150  "
									onClick={() => {
										toggleAuthPopup();
										setResetPassword(true);
										setCurrentAction('forgot-password');
									}}
								>
									<h1 className="text-sm">
										{' '}
										{user?.password ? 'Change password' : 'Set a password'}
									</h1>
									<MdOutlineKeyboardArrowRight className="text-sm " />
								</button>
							</div>
						</div>
						<button
							className="bg-purple  rounded-full w-full  flex items-center justify-center  h-[40px] gap-2 duration-300 hover:ring  ring-purple ring-offset-1"
							onClick={() => {
								toggleLogoutPrompt();
								setCurrentAction('log-in');
								setResetPassword(false);
							}}
						>
							<CiLogout className="text-white" />
							<span className="norm-mid text-white text-sm">Log Out</span>
						</button>
					</div>
				)}
			</div>

			<LogoutPrompt
				logoutPrompt={logoutPrompt}
				logoutPromptRef={logoutPromptRef}
				togglePopup={toggleLogoutPrompt}
				isLogoutPromptVisible={logoutPromptVisible}
			/>
			<EditName
				isActive={changeNamePrompt}
				isVisible={changeNamePromptVisible}
				togglePopup={toggleChangeNamePrompt}
				ref={changeNamePromptRef}
				setDisable={disableChangeNamePrompt}
			/>
			<EditProfile
				isVisible={changeProfilePromptVisible}
				isActive={changeProfilePrompt}
				ref={changeProfilePromptRef}
				togglePopup={toggleChangeProfilePrompt}
				setDisable={disableChangeProfilePrompt}
			/>
			<UpdateBioPrompt
				isVisible={changeBioPromptVisible}
				isActive={changeBioPrompt}
				ref={changeBioPromptRef}
				togglePopup={toggleChangeBioPrompt}
				setDisable={disableChangeBioPrompt}
			/>
		</>
	);
};

export default ProfileDropdown;

