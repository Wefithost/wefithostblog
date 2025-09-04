import { FaEllipsisH } from 'react-icons/fa';
import { alert_type } from '~/types/alerts';
import { formatDate } from '~/utils/format-date';
import { usePopup } from '~/utils/toggle-popups';
import { CgDetailsMore } from 'react-icons/cg';
import Link from 'next/link';
interface alertTypes {
	alert: alert_type;
}
const Alert = ({ alert }: alertTypes) => {
	const statusColors: Record<string, string> = {
		create: 'bg-green-50',
		delete: 'bg-red-50',
		edit: 'bg-yellow-50',
		info: 'bg-blue-50',
	};
	const {
		isVisible: detailsPromptVisible,
		isActive: detailsPrompt,
		togglePopup: toggleDetailsPrompt,
		ref: detailsPromptRef,
	} = usePopup();
	console.log('alert', alert);
	return (
		<>
			<div
				className={`w-full flex gap-1 ${
					statusColors[alert?.status ?? ''] || 'bg-white'
				}  border-t  border-t-lightGrey `}
			>
				<div className="w-[20%] py-2 px-3 text-sm">
					{alert?.triggered_by === null
						? 'A reader'
						: `${alert?.triggered_by?.first_name} ${
								alert?.triggered_by?.last_name || ''
						  }`}
				</div>
				<div
					className={`w-[15%] py-2 px-3 text-sm ${
						alert.triggered_by?.role === 'super_admin'
							? ' text-[#783A71]'
							: alert.triggered_by?.role === 'admin'
							? ' text-[#a37a00]'
							: alert.triggered_by?.role === 'member'
							? ' text-[#2563EB]'
							: 'text-black'
					}`}
				>
					{alert?.triggered_by === null
						? 'reader'
						: `${alert?.triggered_by?.role}`}
				</div>
				<div className="w-[30%] py-2 px-3 text-sm">{alert?.message}</div>
				<div className="w-[25%] py-2 px-3 text-sm">
					{' '}
					{formatDate(alert?.createdAt, true)}
				</div>
				<div className="w-[10%] py-2 px-3 flex items-center   text-sm text-end justify-end relative">
					<FaEllipsisH
						className="text-gray-500 cursor-pointer "
						onClick={toggleDetailsPrompt}
					/>
				</div>
			</div>
			{detailsPrompt && (
				<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
					<div
						className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-white  items-center      ${
							detailsPromptVisible ? '' : 'mid-popup-hidden'
						}  `}
						ref={detailsPromptRef}
					>
						<div className="flex flex-col  items-center w-full">
							<CgDetailsMore className="text-3xl" />

							<div className="flex flex-col gap-2 ">
								<h1 className="text-2xl text-center">More details</h1>
							</div>
						</div>
						<div className="flex w-full flex-col ">
							<Row
								header="User"
								content={`${alert?.triggered_by?.first_name} ${alert?.triggered_by?.last_name}`}
							/>
							<Row
								header="Role"
								content={`${
									alert?.triggered_by === null
										? 'reader'
										: alert?.triggered_by?.role
								}`}
							/>
							<Row header="Action" content={`${alert?.message}`} />
							<Row
								header="Date"
								content={`${formatDate(alert?.createdAt, true)}`}
							/>
							<Row header="Status" content={`${alert?.status}`} />
							{alert?.status !== 'delete' && (
								<div className="flex  w-full  border-b-2 border-gray-300 text-xs divide-gray-300 divide-x">
									<div className="text-start w-[50%] py-2 px-1">
										<h1>{alert?.link?.label}:</h1>
									</div>
									<div className="text-end w-[50%] py-2 px-1">
										{alert?.type === 'account_messaged' ||
										alert?.type === 'user_subscribed' ? (
											<p className="text-black">{alert?.link?.url}</p>
										) : (
											<Link
												href={`/admin${alert?.link?.url}`}
												className="text-purple"
											>
												{alert?.link?.url}
											</Link>
										)}
									</div>
								</div>
							)}
						</div>

						<div className="flex gap-4 w-full">
							<button
								className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-full text-white  text-xs "
								onClick={toggleDetailsPrompt}
							>
								Done
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Alert;

interface rowProps {
	header: string;
	content: string;
}
const Row = ({ header, content }: rowProps) => {
	return (
		<div className="flex  w-full  border-b-2 border-gray-300 text-xs divide-gray-300 divide-x">
			<div className="text-start w-[50%] py-2 px-1">
				<h1>{header}:</h1>
			</div>
			<div className="text-end w-[50%] py-2 px-1">
				<h1>{content}</h1>
			</div>
		</div>
	);
};

