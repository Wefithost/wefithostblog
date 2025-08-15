'use client';

import { useAuthContext } from '~/app/context/auth-context';
import { usePageFetch } from '~/utils/fetch-page-data';
import Loader from '~/app/components/loader';
import EmptyState from '~/app/components/empty-state';
import { user_type } from '~/types/user';
import MemberCard from '~/app/admin/components/user-cards/members-card';
const Members = () => {
	const { user, loading } = useAuthContext();
	const {
		fetchedData: members,
		isFetching,
		error,
		refetch,
	} = usePageFetch<user_type[]>({
		basePath: `/api/fetch-members?adminId=${user?._id}`,
		ids: [],
		eventKey: 'membersUpdated',
		enabled: !!user && !loading,
		//  deps:[loading,user]
	});

	return (
		<section className="flex flex-col gap-8  py-6 px-4 ">
			<div className="flex items-center justify-between w-full max-2xs:flex-col max-2xs:gap-2 max-2xs:items-start ">
				<h1 className="flex text-3xl neue-thin uppercase max-md:text-2xl  max-sm:text-xl">
					Members ({members?.length})
				</h1>
			</div>
			<Loader error={error} fetching={isFetching} try_again={refetch}>
				{members && members?.length > 0 ? (
					<div className="flex gap-4 w-full flex-wrap">
						{members.map((member) => (
							<MemberCard key={member?.email} member={member} />
						))}
					</div>
				) : (
					<EmptyState message="No members yet" />
				)}
			</Loader>
		</section>
	);
};

export default Members;

