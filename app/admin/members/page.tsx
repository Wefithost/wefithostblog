'use client';

import { useAuthContext } from '~/app/context/auth-context';
import Loader from '~/app/components/loader';
import EmptyState from '~/app/components/empty-state';
import { user_type } from '~/types/user';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Member from '../components/members-row/member';
const Members = () => {
	const { user } = useAuthContext();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10; // Users per page

	const [pagedMembers, setPagedMembers] = useState<user_type[]>([]);
	const [totalMembers, setTotalMembers] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');
	const totalPages = Math.ceil(totalMembers / pageSize);
	const placeholders = Array(Math.max(0, pageSize - pagedMembers.length)).fill(
		null,
	);
	useEffect(() => {
		if (!user) return;

		const fetchMembers = async () => {
			setFetching(true);
			setError('');
			await apiRequest({
				url: `/api/members/fetch-members?adminId=${user._id}&skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedMembers(res.members);
					setTotalMembers(res.members_length);
				},
				onError: (error) => setError(error),
				onFinally: () => setFetching(false),
			});
		};

		fetchMembers();

		const handleMembersUpdated = () => fetchMembers();
		window.addEventListener('membersUpdated', handleMembersUpdated);

		return () => {
			window.removeEventListener('membersUpdated', handleMembersUpdated);
		};
	}, [currentPage, user]);

	return (
		<section className="flex flex-col gap-4  py-6 px-4 ">
			<div className="flex items-center justify-between w-full max-2xs:flex-col max-2xs:gap-2 max-2xs:items-start ">
				<h1 className="flex text-3xl neue-thin uppercase max-md:text-2xl  max-sm:text-xl">
					Members ({totalMembers})
				</h1>
			</div>
			<Loader error={error} fetching={fetching} classname_override="!h-[450px]">
				<div className="flex flex-col w-full  rounded-md  border overflow-hidden  border-[#dfdde3]">
					<div className="w-full flex gap-1 bg-[#EAEAEC]">
						<div className="w-[30%] py-2 px-3 text-sm">Name</div>
						<div className="w-[30%] py-2 px-3 text-sm">Email</div>
						<div className="w-[15%] py-2 px-3 text-sm">Role</div>
						<div className="w-[15%] py-2 px-3 text-sm">Joined</div>
						<div className="w-[10%] py-2 px-3 text-sm"></div>
					</div>
					{pagedMembers && pagedMembers.length > 0 ? (
						pagedMembers && (
							<>
								{pagedMembers.map((member) => (
									<Member key={member?._id} member={member} />
								))}
								{placeholders.map((_, i) => (
									<div
										className=" h-[40px] flex items-center  px-3 text-sm border-t    border-t-lightGrey bg-white w-full"
										key={i}
									></div>
								))}
							</>
						)
					) : (
						<EmptyState message="No members yet" />
					)}
				</div>
			</Loader>

			{pagedMembers && pagedMembers.length > 0 && (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						{/* Prev */}
						<button
							onClick={() => {
								setCurrentPage((p) => Math.max(p - 1, 1));
								document
									.getElementById('members-section')
									?.scrollIntoView({ behavior: 'smooth' });
							}}
							disabled={currentPage === 1}
							className={`flex items-center justify-center h-7 w-7 rounded-md ${
								currentPage === 1
									? 'bg-white text-gray-700 opacity-40'
									: 'bg-white text-black hover:bg-gray-200'
							}`}
						>
							<MdKeyboardArrowLeft />
						</button>

						{(() => {
							const pages: (number | string)[] = [];
							const window = 2;

							for (let i = 1; i <= totalPages; i++) {
								if (
									i === 1 ||
									i === totalPages ||
									(i >= currentPage - window && i <= currentPage + window)
								) {
									pages.push(i);
								} else if (
									(i === currentPage - window - 1 &&
										currentPage - window > 2) ||
									(i === currentPage + window + 1 &&
										currentPage + window < totalPages - 1)
								) {
									pages.push('...');
								}
							}

							return pages.map((page, idx) =>
								page === '...' ? (
									<span key={idx} className="px-2">
										…
									</span>
								) : (
									<button
										key={page}
										onClick={() => {
											setCurrentPage(page as number);
											document
												.getElementById('members-section')
												?.scrollIntoView({ behavior: 'smooth' });
										}}
										className={`px-3 py-1 rounded-md  ${
											page === currentPage
												? 'bg-white text-black'
												: ' text-gray-600 hover:text-black'
										}`}
									>
										{page}
									</button>
								),
							);
						})()}

						{/* Next */}
						<button
							onClick={() => {
								setCurrentPage((p) => Math.min(p + 1, totalPages));
								document
									.getElementById('members-section')
									?.scrollIntoView({ behavior: 'smooth' });
							}}
							disabled={currentPage === totalPages}
							className={`flex items-center justify-center h-7 w-7 rounded-md  ${
								currentPage === totalPages
									? 'bg-white text-gray-700 opacity-60'
									: 'bg-white text-black hover:bg-gray-200'
							}`}
						>
							<MdKeyboardArrowRight />
						</button>
					</div>
				</div>
			)}
		</section>
	);
};

export default Members;

