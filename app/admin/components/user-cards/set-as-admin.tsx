import Image from 'next/image';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/app/context/auth-context';

import loader from '~/public/icons/spin-white.svg';
import { user_type } from '~/types/user';
import { apiRequest } from '~/utils/api-request';
interface setAdminProps {
	adminPromptVisible: boolean;
	setAdminPrompt: boolean;
	toggleSetAdmin: () => void;
	setAdminRef: React.RefObject<HTMLDivElement | null>;
	member: user_type;
}
const SetAsAdmin = ({
	adminPromptVisible,
	setAdminPrompt,
	toggleSetAdmin,
	setAdminRef,
	member,
}: setAdminProps) => {
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const { user } = useAuthContext();
	const handleSetAdmin = async () => {
		if (submitting) return;

		if (!member?._id) {
			setError('Missing required fields');
			return;
		}

		setSubmitting(true);
		await apiRequest({
			url: '/api/set-as-admin',
			method: 'PATCH',
			body: {
				memberId: member?._id,
				userId: user?._id,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('userUpdated'));
				window.dispatchEvent(new CustomEvent('usersUpdated'));
				setSuccessful(true);
				setTimeout(() => {
					toggleSetAdmin();
				}, 500);
				toast.success(
					`${member?.first_name} ${member?.last_name} made ${
						member?.role === 'member' ? 'an admin' : 'a '
					}`,
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
			},
		});
	};
	return (
		setAdminPrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
						adminPromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={setAdminRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<GrUserAdmin />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl louize text-center">
								{member?.role !== 'member' ? 'Set as user' : 'Set as admin'}
							</h1>
							{member?.role !== 'member' ? (
								<p className="text-sm neue-light  text-center">
									You’re about to set{' '}
									<span className="neue-bold">
										{` ${member?.first_name} ${member?.last_name} `}{' '}
									</span>
									to a user. He/She would be will no longer be able to edit,
									delete and add products. Are you sure you want to?
								</p>
							) : (
								<p className="text-sm neue-light  text-center">
									You’re about to set{' '}
									<span className="neue-bold">
										{`${member?.first_name} ${member?.last_name}`}{' '}
									</span>
									as an admin. He/She would be able to edit, delete and add
									products. Are you sure you want to?
								</p>
							)}
						</div>
					</div>
					{error && (
						<h1 className="text-[11px] neue-light text-red text-center">
							{error}
						</h1>
					)}
					<div className="flex gap-4 w-full">
						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen   duration-150  hover:ring-[2px]  ring-softGreen  ring-offset-2  text-center w-[60%]"
							onClick={handleSetAdmin}
						>
							<span className=" text-white uppercase  text-xs  text-center">
								{successful ? (
									<FaCheck className="w-6" />
								) : submitting ? (
									<Image src={loader} alt="" className="w-6" />
								) : member?.role !== 'member' ? (
									'Set as user'
								) : (
									'Set as admin'
								)}
							</span>
						</button>
						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-grey     duration-150 hover:ring-[2px]  ring-grey    ring-offset-2  text-center w-[40%] text-white uppercase text-xs "
							onClick={toggleSetAdmin}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default SetAsAdmin;

