'use client';

import { useAuthContext } from '~/app/context/auth-context';
import Loader from '~/app/components/loader';
import EmptyState from '~/app/components/empty-state';
import { user_type } from '~/types/user';
import { formatDate } from '~/utils/format-date';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FaEllipsisH, FaUserAlt } from 'react-icons/fa';
import { usePopup } from '~/utils/toggle-popups';
import { GrUserAdmin } from 'react-icons/gr';
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
				url: `/api/fetch-members?adminId=${user._id}&skip=${
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
	const {
		isActive: memberPrompt,
		isVisible: memberPromptVisible,
		ref: memberPromptRef,
		setDisableToggle: disablememberPrompt,
		togglePopup: toggleMemberPrompt,
	} = usePopup();
	const {
		isActive: setRolePrompt,
		isVisible: setRolePromptVisible,
		ref: setRolePromptRef,
		setDisableToggle: disableSetRolePrompt,
		togglePopup: toggleSetRolePrompt,
	} = usePopup();
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
									<div
										className="w-full flex gap-1 bg-white border-t    border-t-lightGrey hover:bg-gray-50"
										key={member._id}
									>
										<div className="w-[30%] h-[40px] flex items-center  px-3  gap-2">
											{/* eslint-disable-next-line */}
											<img
												src={member?.profile ?? '/icons/default-user.svg'}
												className="w-7 h-7 object-cover rounded-full max-sm:w-6 max-sm:h-6"
												alt=""
											/>
											<span className="text-sm  text-gray-700 max-sm:text-xs ">
												{member?.first_name} {member?.last_name}
											</span>
										</div>
										<div className="w-[30%] h-[40px] flex items-center  px-3 text-sm">
											{member?.email}
										</div>
										<div className="w-[15%] h-[40px]  px-3 text-sm flex items-center">
											<h1
												className={`text-xs px-2 rounded-sm
    ${
			member?.role === 'super_admin'
				? 'bg-[hsl(308,100%,97%)] text-[#783A71]' // Red
				: member?.role === 'admin'
				? 'bg-[#FFFBDB] text-[#a37a00]' // Yellow
				: 'bg-[#DBEAFE] text-[#2563EB]' // Blue (member)
		}`}
											>
												{member?.role}
											</h1>
										</div>
										<div className="w-[15%] h-[40px] flex items-center  px-3 text-sm">
											{formatDate(member?.createdAt as string)}
										</div>
										<div className="w-[10%] h-[40px] flex items-center  px-3 text-sm text-end justify-end relative">
											<FaEllipsisH
												className="text-gray-500 cursor-pointer "
												onClick={toggleMemberPrompt}
											/>
											{memberPrompt && (
												<div
													className={`flex  flex-col bg-white shadow-lg  w-[130px] rounded-md   duration-150 absolute top-2 right-10  divide-y divide-lightGrey overflow-hidden border border-lightGrey z-20   ${
														memberPromptVisible ? 'opacity-100' : 'opacity-0 '
													}`}
													ref={memberPromptRef}
												>
													<button
														className="py-2 w-full text-[13px]  text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															toggleSetRolePrompt();
														}}
													>
														{member?.role === 'member' ? (
															<FaUserAlt />
														) : (
															<GrUserAdmin />
														)}
														<span>
															{member?.role !== 'member'
																? 'Set as user'
																: 'Set as admin'}
														</span>
													</button>
												</div>
											)}
										</div>
									</div>
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

