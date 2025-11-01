import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { subscribers_type } from '~/types/subscribers';
import { apiRequest } from '~/utils/api-request';
interface UnsubscribePromptProps {
	unsubscribePromptVisible: boolean;
	unsubscribePrompt: boolean;
	toggleUnsubscribePrompt: () => void;
	unsubscribePromptRef: React.RefObject<HTMLDivElement | null>;
	subscriber: subscribers_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const UnsubscribePrompt = ({
	unsubscribePromptVisible,
	unsubscribePrompt,
	toggleUnsubscribePrompt,
	unsubscribePromptRef,
	subscriber,
	setDisableToggle,
}: UnsubscribePromptProps) => {
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const { user } = useAuthContext();
	const handleUnsubscribePrompt = async () => {
		if (submitting) return;

		if (!subscriber?._id) {
			setError('Missing required fields');
			return;
		}

		setSubmitting(true);
		setDisableToggle(true);
		await apiRequest({
			url: '/api/subscriptions/admin-unsubscribe',
			method: 'POST',
			body: {
				email: subscriber?.email,
				adminId: user?._id,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('refetchSubscribers'));
				setSuccessful(true);
				setTimeout(() => {
					toggleUnsubscribePrompt();
				}, 500);
				toast.success(
					`${subscriber?.email} account unsubscribed successfully`,
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
		unsubscribePrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-white  items-center      ${
						unsubscribePromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={unsubscribePromptRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<GrUserAdmin className="text-2xl" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center">Unsubscribe Account</h1>
							<p className="text-sm  text-center">
								You’re about to unsubscribe
								<span className="neue-bold">
									{` ${subscriber?.email} `}{' '}
								</span>{' '}
								account. Are you sure you want to?
							</p>
						</div>
					</div>
					{error && (
						<h1 className="text-[11px] text-red text-center">{error}</h1>
					)}
					<div className="flex gap-4 w-full">
						<AsyncButton
							action="Unsubscribe account"
							classname_override="!h-[40px] text-xs"
							loading={submitting}
							success={successful}
							disabled={submitting}
							onClick={handleUnsubscribePrompt}
						/>

						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-[40%] text-white  text-xs "
							onClick={toggleUnsubscribePrompt}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default UnsubscribePrompt;

