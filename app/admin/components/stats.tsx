import { useAuthContext } from '~/app/context/auth-context';
import { useFetch } from '~/utils/fetch-page-data';
interface membersProps {
	totalMembers: number;
	memberSubscribedToday: number;
	totalArticles: number;
	articleCreatedToday: number;
}
const Stats = () => {
	const { loading, user } = useAuthContext();

	const {
		fetchedData: stats,
		isFetching,
		error,
		refetch,
	} = useFetch<membersProps>({
		basePath: `/api/stats?adminId=${user?._id}`,
		ids: [],
		eventKey: 'statsUpdated',
		dataKey: 'stats',
		enabled: !!user && !loading,
		//  deps:[loading,user]
	});
	return (
		<div className=" grid grid-cols-3      justify-between  rounded-[40px]  w-full gap-3 max-sm:grid-cols-2 max-2xs:grid-cols-1">
			<div className=" p-5  rounded-lg bg-gray-50  flex flex-col gap-2 items-start  w-full  max-md:p-2">
				<h1 className="text-sm text-gray-600  leading-none ">Total Members</h1>
				<h1 className="text-3xl  poppins">{stats?.totalMembers || 0}</h1>

				{stats && stats?.memberSubscribedToday > 0 ? (
					<div className="bg-[#ECFCF3]     px-3 py-1 rounded-full text-xs   ">
						{stats?.memberSubscribedToday} subscribed today
					</div>
				) : (
					<div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs   ">
						No one subscribed today
					</div>
				)}
			</div>

			<div className=" p-5  rounded-lg bg-gray-50  flex flex-col gap-2 items-start  w-full max-md:p-2">
				<h1 className="text-sm text-gray-600  leading-none ">Total Articles</h1>
				<h1 className="text-3xl  poppins">{stats?.totalArticles || 0}</h1>
				{stats && stats?.articleCreatedToday > 0 ? (
					<div className="bg-[#ECFCF3]     px-3 py-1 rounded-full text-xs   ">
						{stats?.articleCreatedToday} articles created today
					</div>
				) : (
					<div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs   ">
						No article created today
					</div>
				)}
			</div>
			<div className=" p-5  rounded-lg bg-gray-50  flex flex-col gap-2 items-start  w-full  max-md:p-2">
				<h1 className="text-sm text-gray-600  leading-none ">Total Visitors</h1>
				<h1 className="text-3xl  ">100</h1>
				<div className="bg-[#ECFCF3]     px-3 py-1 rounded-full text-xs   ">
					10 visited today
				</div>
			</div>
		</div>
	);
};

export default Stats;

