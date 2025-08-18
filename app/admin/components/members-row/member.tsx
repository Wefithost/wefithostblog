import SetAsAdmin from './set-role';
import { usePopup } from '~/utils/toggle-popups';
import { user_type } from '~/types/user';
import { GrUserAdmin } from 'react-icons/gr';
import { FaEllipsisH, FaUserAlt } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
interface memberProps {
	member: user_type;
}
const Member = ({ member }: memberProps) => {
	const {
		isVisible: promptVisible,
		isActive: prompt,
		togglePopup: togglePrompt,
		ref: promptRef,
	} = usePopup();

	const {
		isVisible: rolePromptVisible,
		isActive: rolePrompt,
		togglePopup: toggleSetRolePrompt,
		ref: setRolePromptRef,
		setDisableToggle: disableRolePrompt,
	} = usePopup();

	return (
		<>
			<div
				className="w-full flex gap-1 bg-white border-t    border-t-lightGrey hover:bg-gray-50"
				key={member._id}
			>
				<div className="w-[30%] h-[40px] flex items-center  px-3  gap-2">
					{/* eslint-disable-next-line */}
					<img
						src={member?.profile ?? '/icons/default-user.svg'}
						className="w-7 h-7 object-cover rounded-full max-sm:w-6 max-sm:h-6"
						alt=""
					/>
					<span className="text-sm  text-gray-700 max-sm:text-xs ">
						{member?.first_name} {member?.last_name}
					</span>
				</div>
				<div className="w-[30%] h-[40px] flex items-center  px-3 text-sm">
					{member?.email}
				</div>
				<div className="w-[15%] h-[40px]  px-3 text-sm flex items-center">
					<h1
						className={`text-xs px-2 rounded-sm
    ${
			member?.role === 'super_admin'
				? 'bg-[hsl(308,100%,97%)] text-[#783A71]' // Red
				: member?.role === 'admin'
				? 'bg-[#FFFBDB] text-[#a37a00]' // Yellow
				: 'bg-[#DBEAFE] text-[#2563EB]' // Blue (member)
		}`}
					>
						{member?.role}
					</h1>
				</div>
				<div className="w-[15%] h-[40px] flex items-center  px-3 text-sm">
					{formatDate(member?.createdAt as string)}
				</div>
				<div className="w-[10%] h-[40px] flex items-center  px-3 text-sm text-end justify-end relative">
					<FaEllipsisH
						className="text-gray-500 cursor-pointer "
						onClick={togglePrompt}
					/>
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
									toggleSetRolePrompt();
								}}
							>
								{member?.role === 'member' ? <FaUserAlt /> : <GrUserAdmin />}
								<span>
									{member?.role !== 'member' ? 'Set as user' : 'Set as admin'}
								</span>
							</button>
						</div>
					)}
				</div>
			</div>
			<SetAsAdmin
				rolePrompt={rolePrompt}
				rolePromptVisible={rolePromptVisible}
				toggleSetRole={toggleSetRolePrompt}
				setRoleRef={setRolePromptRef}
				member={member}
				setDisableToggle={disableRolePrompt}
			/>
		</>
	);
};

export default Member;

