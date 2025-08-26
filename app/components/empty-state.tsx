import { MdOutlineCreditCardOff } from 'react-icons/md';
import { IconType } from 'react-icons';

interface emptyProps {
	message: string;
	container_override?: string;
	override?: string;
	icon?: IconType; // 👈 accepts any react-icon component
}

const EmptyState = ({
	container_override,
	override,
	message,
	icon: Icon = MdOutlineCreditCardOff, // 👈 fallback to CreditCardOff
}: emptyProps) => {
	return (
		<section
			className={`${container_override} w-full min-h-[50vh] flex items-center justify-center`}
		>
			<div
				className={`flex flex-col gap-2 items-center w-[400px] rounded-2xl bg-lightGrey ${override} p-5 h-[300px] justify-center`}
			>
				<Icon className="text-3xl" /> {/* 👈 dynamically render */}
				<p>{message}</p>
			</div>
		</section>
	);
};

export default EmptyState;

