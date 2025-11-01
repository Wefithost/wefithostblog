import EmptyState from '~/app/components/empty-state';
import Loader from '~/app/components/loader';
import SubscribersRow from './subscribers-row/subscribers-row';
import { subscribers_type } from '~/types/subscribers';

interface subscribers {
	pagedSubscribers: subscribers_type[] | null;
	pageSize: number;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	fetching: boolean;
	error: string;
}
const SubscribersTable = ({
	pagedSubscribers,
	pageSize,
	searchTerm,
	setSearchTerm,
	fetching,
	error,
}: subscribers) => {
	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const query = event.target.value;
		setSearchTerm?.(query);
	};
	const hasSubscribers = pagedSubscribers && pagedSubscribers.length > 0;
	const hasSearch = searchTerm && searchTerm.trim().length > 0;
	return (
		<>
			<input
				className={`h-[40px]  py-1 px-3 bg-white  text-black   text-sm    focus:ring-[1px]    ring-purple    outline-none w-[350px]  duration-150 rounded-sm max-2xl:w-[250px] max-lg:w-full self-end
pr-8
            `}
				placeholder="Search for a subscriber"
				value={searchTerm}
				onChange={(e) => {
					handleSearchChange(e);
				}}
			/>
			<section className="flex gap-3 flex-col w-full  overflow-auto justify-end">
				<div className="flex flex-col   rounded-md  border   border-[#dfdde3] w-full min-w-[700px]">
					<div className="w-full flex gap-1 bg-[#EAEAEC]">
						<div className="w-[40%] py-2 px-3 text-sm">Email</div>
						<div className="w-[25%] py-2 px-3 text-sm">Role</div>
						<div className="w-[20%] py-2 px-3 text-sm">Joined</div>

						<div className="w-[15%] py-2 px-3 text-sm"></div>
					</div>
					<Loader
						classname_override="!h-[400px]"
						fetching={fetching}
						error={error}
					>
						{hasSubscribers ? (
							<>
								{pagedSubscribers.map((subscriber) => (
									<SubscribersRow
										key={subscriber?._id}
										subscriber={subscriber}
									/>
								))}
								{Array(Math.max(0, pageSize - pagedSubscribers.length))
									.fill(null)
									.map((_, i) => (
										<div
											key={i}
											className="h-[40px] flex items-center px-3 text-sm border-t border-t-lightGrey bg-white w-full"
										></div>
									))}
							</>
						) : (
							<EmptyState
								message={
									hasSearch
										? 'No subscriber matches your search'
										: 'No subscribers yet'
								}
							/>
						)}
					</Loader>
				</div>
			</section>
		</>
	);
};

export default SubscribersTable;

