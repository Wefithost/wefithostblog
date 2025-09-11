import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdBlock } from 'react-icons/md';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { user_type } from '~/types/user';
import { apiRequest } from '~/utils/api-request';
interface blockPromptProps {
	blockPromptVisible: boolean;
	blockPrompt: boolean;
	toggleBlockPrompt: () => void;
	blockPromptRef: React.RefObject<HTMLDivElement | null>;
	member: user_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlockPrompt = ({
	blockPromptVisible,
	blockPrompt,
	toggleBlockPrompt,
	blockPromptRef,
	member,
	setDisableToggle,
}: blockPromptProps) => {
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const { user } = useAuthContext();
	const handleBlockPrompt = async () => {
		if (submitting) return;

		if (!member?._id) {
			setError('Missing required fields');
			return;
		}

		setSubmitting(true);
		setDisableToggle(true);

		await apiRequest({
			url: '/api/members/block-account',
			method: 'POST',
			body: {
				memberId: member?._id,
				adminId: user?._id,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('refetchMembers'));
				setSuccessful(true);
				setTimeout(() => {
					toggleBlockPrompt();
				}, 500);

				toast.success(
					`${member?.first_name} ${
						member?.last_name || ''
					} account Blocked successfully`,
					{
						icon: <FaCheck color="white" />,
					},
				);
			},

			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSuccessful(false);
				setSubmitting(false);
				setDisableToggle(false);
			},
		});
	};
	return (
		blockPrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-white  items-center      ${
						blockPromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={blockPromptRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<MdBlock className="text-2xl" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center">Block Account</h1>
							<p className="text-sm  text-center">
								You’re about to block
								<span className="neue-bold">
									{` ${member?.first_name} ${member?.last_name || ''} `}{' '}
								</span>
								. Are you sure you want to?
							</p>
						</div>
					</div>
					{error && (
						<h1 className="text-[11px] text-red text-center">{error}</h1>
					)}
					<div className="flex gap-4 w-full">
						<AsyncButton
							action="Block"
							classname_override="!h-[40px] text-xs"
							loading={submitting}
							success={successful}
							disabled={submitting}
							onClick={handleBlockPrompt}
						/>

						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-[40%] text-white  text-xs "
							onClick={toggleBlockPrompt}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default BlockPrompt;

