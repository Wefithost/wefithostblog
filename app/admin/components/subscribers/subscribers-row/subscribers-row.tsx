import { FaEllipsisH } from 'react-icons/fa';
import { MdOutlineUnsubscribe } from 'react-icons/md';
import { useAuthContext } from '~/app/context/auth-context';
import { subscribers_type } from '~/types/subscribers';
import { formatDate } from '~/utils/format-date';
import { usePopup } from '~/utils/toggle-popups';
import UnsubscribePrompt from './unsubscribe-account';

interface subscriberProps {
	subscriber: subscribers_type;
}
const SubscribersRow = ({ subscriber }: subscriberProps) => {
	const { user } = useAuthContext();
	const {
		isVisible: promptVisible,
		isActive: prompt,
		togglePopup: togglePrompt,
		ref: promptRef,
	} = usePopup();

	const {
		isVisible: unsubscribeVisible,
		isActive: unsubscribe,
		togglePopup: toggleUnsubscribePrompt,
		ref: unsubscribeRef,
		setDisableToggle: disableUnsubscribePrompt,
	} = usePopup();
	return (
		<>
			<div
				className="w-full flex gap-1 bg-white border-t    border-t-lightGrey hover:bg-gray-50"
				key={subscriber._id}
			>
				<div className="w-[40%] h-[40px] flex items-center  px-3  ">
					<span className="text-sm  text-gray-700 max-sm:text-xs ">
						{subscriber?.email}
					</span>
				</div>

				<div className="w-[25%] h-[40px]  px-3 text-sm flex items-center">
					<h1
						className={`text-xs px-2 rounded-sm
							${
								subscriber?.role === 'subscriber'
									? 'bg-[#DBFEEA] text-[hsl(139,83%,40%)]'
									: subscriber?.role === 'super_admin'
									? 'bg-[hsl(308,100%,97%)] text-[#783A71]' // Red
									: subscriber?.role === 'admin'
									? 'bg-[#FFFBDB] text-[#a37a00]' // Yellow
									: 'bg-[#DBEAFE] text-[#2563EB]' // Blue (subscriber)
							}
    `}
					>
						{subscriber?.role}
					</h1>
				</div>

				<div className="w-[20%] h-[40px] flex items-center  px-3 text-sm">
					{formatDate(subscriber?.createdAt as string)}
				</div>
				<div className="w-[15%] h-[40px] flex items-center  px-3 text-sm text-end justify-end relative">
					{user?.role === 'super_admin' && (
						<FaEllipsisH
							className="text-gray-500 cursor-pointer "
							onClick={togglePrompt}
						/>
					)}

					{prompt && (
						<div
							className={`flex  flex-col bg-white shadow-lg  w-[180px] rounded-md   duration-150 absolute top-2 right-10  divide-y divide-lightGrey overflow-hidden border border-lightGrey z-20   ${
								promptVisible ? 'opacity-100' : 'opacity-0 '
							}`}
							ref={promptRef}
						>
							<button
								className="py-2 w-full text-[13px]  text-red flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									toggleUnsubscribePrompt();
								}}
							>
								<MdOutlineUnsubscribe />
								<span>Unsubscribe account</span>
							</button>
						</div>
					)}
				</div>
			</div>
			<UnsubscribePrompt
				unsubscribePromptVisible={unsubscribeVisible}
				unsubscribePrompt={unsubscribe}
				toggleUnsubscribePrompt={toggleUnsubscribePrompt}
				unsubscribePromptRef={unsubscribeRef}
				subscriber={subscriber}
				setDisableToggle={disableUnsubscribePrompt}
			/>
		</>
	);
};

export default SubscribersRow;

