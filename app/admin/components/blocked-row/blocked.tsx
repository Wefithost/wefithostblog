import { usePopup } from '~/utils/toggle-popups';
import { FaEllipsisH } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { useAuthContext } from '~/app/context/auth-context';
import UnblockPrompt from './unblock';
import { blocked_type } from '~/types/blocked';

interface blockedProps {
	blocked: blocked_type;
}
const BlockedRow = ({ blocked }: blockedProps) => {
	const { user } = useAuthContext();

	const {
		isVisible: unblockPromptVisible,
		isActive: unblockPrompt,
		togglePopup: toggleUnBlockPrompt,
		ref: unblockPromptRef,
		setDisableToggle: disableUnBlockPrompt,
	} = usePopup();
	return (
		<>
			<div
				className="w-full flex gap-1 bg-white border-t    border-t-lightGrey hover:bg-gray-50"
				key={blocked._id}
			>
				<div className="w-[25%] h-[40px] flex items-center  px-3  gap-2">
					<span className="text-sm  text-gray-700 max-sm:text-xs ">
						{blocked?.blocked?.email || blocked?.ip_address}
					</span>
				</div>
				<div className="w-[30%] h-[40px] flex items-center  px-3 text-sm">
					{blocked?.blocked_by.first_name} {blocked?.blocked_by.last_name || ''}
				</div>
				<div className="w-[20%] h-[40px]  px-3 text-sm flex items-center">
					<h1 className={`text-xs  rounded-sm`}>{blocked?.reason}</h1>
				</div>
				<div className="w-[15%] h-[40px] flex items-center  px-3 text-sm">
					{formatDate(blocked?.createdAt as string)}
				</div>
				<div className="w-[10%] h-[40px] flex items-center  px-3 text-sm text-end justify-end relative">
					{user?.role === 'super_admin' && (
						<FaEllipsisH
							className="text-gray-500 cursor-pointer "
							onClick={toggleUnBlockPrompt}
						/>
					)}
				</div>
			</div>

			<UnblockPrompt
				unblockPromptVisible={unblockPromptVisible}
				unblockPrompt={unblockPrompt}
				toggleUnblockPrompt={toggleUnBlockPrompt}
				unblockPromptRef={unblockPromptRef}
				blocked={blocked}
				setDisableToggle={disableUnBlockPrompt}
			/>
		</>
	);
};

export default BlockedRow;

