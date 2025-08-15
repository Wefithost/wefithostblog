import SetAsAdmin from './set-as-admin';
import { usePopup } from '~/utils/toggle-popups';
import { user_type } from '~/types/user';
import { GrUserAdmin } from 'react-icons/gr';
import { FaEllipsisV, FaUserAlt } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
interface memberProps {
	member: user_type;
}
const MemberCard = ({ member }: memberProps) => {
	const {
		isVisible: promptVisible,
		isActive: prompt,
		togglePopup: togglePrompt,
		ref: promptRef,
	} = usePopup();

	const {
		isVisible: setAdminPromptVisible,
		isActive: setAdminPrompt,
		togglePopup: toggleSetAdminPrompt,
		ref: setAdminPromptRef,
	} = usePopup();

	return (
		<>
			<div className="w-[210px]  h-[260px] bg-lightGrey rounded-md shrink-none flex flex-col gap-3 p-2  relative max-dxs:w-full">
				<button
					className={`flex items-center justify-center p-1 bg-[#0000005c] hover:ring ring-purple  duration-150  rounded-full absolute top-2  right-2 z-10   ${
						prompt && 'ring-[1px]'
					}`}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						togglePrompt();
					}}
				>
					<FaEllipsisV />
				</button>
				{prompt && (
					<div
						className={`flex  flex-col bg-white shadow-lg  w-[130px] rounded-md   duration-150 absolute top-2 right-10  divide-y divide-lightGrey overflow-hidden border border-lightGrey z-20   ${
							promptVisible ? 'opacity-100' : 'opacity-0 '
						}`}
						ref={promptRef}
					>
						<button
							className="py-2 w-full text-[13px]  text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								toggleSetAdminPrompt();
							}}
						>
							{member?.role === 'member' ? <FaUserAlt /> : <GrUserAdmin />}
							<span>
								{member?.role !== 'member' ? 'Set as user' : 'Set as admin'}
							</span>
						</button>
					</div>
				)}
				<div className="bg-lightGrey rounded-full h-[180px] overflow-hidden flex items-center justify-center  w-[180px] mx-auto">
					{/* eslint-disable-next-line */}
					<img
						src={member?.profile ? member.profile : '/icons/user.svg'}
						alt=""
						className={`  rounded-full object-cover  ${
							member?.profile ? 'w-full h-[180px]   ' : 'w-16'
						}`}
					/>
				</div>
				<div className="flex flex-col ">
					<div className="flex items-center justify-between  gap-2 leading-none ">
						<h1 className="text-xs uppercase  line-clamp-1">
							{member?.last_name} {member?.first_name}
						</h1>
						<h1
							className={`text-xs  px-2 rounded-full
    ${
			member?.role === 'super_admin'
				? 'border border-[#B91C1C] bg-[#FEE2E2] text-[#B91C1C]' // Red
				: member?.role === 'admin'
				? 'border border-[#a37a00] bg-[#FFFBDB] text-[#a37a00]' // Yellow
				: 'border border-[#2563EB] bg-[#DBEAFE] text-[#2563EB]' // Blue (member)
		}`}
						>
							{member?.role}
						</h1>
					</div>
					<h1 className="text-xs text-[#8D8896] py-1  ">
						Joined{' '}
						<span className=" text-black  ">
							{formatDate(member?.createdAt as string)}
						</span>
					</h1>
				</div>
			</div>
			<SetAsAdmin
				setAdminPrompt={setAdminPrompt}
				adminPromptVisible={setAdminPromptVisible}
				toggleSetAdmin={toggleSetAdminPrompt}
				setAdminRef={setAdminPromptRef}
				member={member}
			/>
		</>
	);
};

export default MemberCard;

