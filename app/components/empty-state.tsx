import { MdOutlineCreditCardOff } from 'react-icons/md';
interface emptyProps {
	message: string;
	container_override?: string;
	override?: string;
}
const EmptyState = ({ container_override, override, message }: emptyProps) => {
	return (
		<section
			className={`${container_override} w-full min-h-[50vh]  flex items-center justify-center "`}
		>
			<div
				className={`flex flex-col gap-2 items-center w-[400px] rounded-2xl bg-lightGrey ${override} p-5 h-[300px] justify-center`}
			>
				<MdOutlineCreditCardOff className="text-3xl" />
				<p>{message}</p>
			</div>
		</section>
	);
};

export default EmptyState;

