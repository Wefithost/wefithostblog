'use client';
import { apiRequest } from '~/utils/api-request';
import SubscribersTable from '../components/subscribers/subscribers-table';
import { useEffect, useState } from 'react';
import { useAuthContext } from '~/app/context/auth-context';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { subscribers_type } from '~/types/subscribers';

const SubscriptionsPage = () => {
	const { user } = useAuthContext();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10; // Users per page

	const [pagedSubscribers, setPagedSubscribers] = useState<subscribers_type[]>(
		[],
	);
	const [totalSubscribers, setTotalSubscribers] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const totalPages = Math.ceil(totalSubscribers / pageSize);

	useEffect(() => {
		if (!user) return;

		const fetchSubscribers = async () => {
			setFetching(true);
			setError('');

			await apiRequest({
				url: `/api/subscriptions/fetch-subscribers?adminId=${user._id}&skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&search=${searchTerm}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedSubscribers(res.subscribers);
					setTotalSubscribers(res.subscribers_length);
				},
				onError: (error) => setError(error),
				onFinally: () => setFetching(false),
			});
		};

		fetchSubscribers();
		const refetchHandler = () => fetchSubscribers();
		window.addEventListener('refetchSubscribers', refetchHandler);

		return () =>
			window.removeEventListener('refetchSubscribers', refetchHandler);
	}, [currentPage, user, searchTerm]);

	return (
		<div className=" w-full  bg-[#f1f1f4] py-4">
			<div className="flex flex-col gap-6  items-start w-full px-4 ">
				<div className="flex items-center justify-between w-full max-2xs:flex-col max-2xs:gap-2 max-2xs:items-start ">
					<h1 className="flex text-3xl neue-thin uppercase max-md:text-2xl  max-sm:text-xl">
						Newsletter Subscriptions
					</h1>
				</div>
				<SubscribersTable
					pagedSubscribers={pagedSubscribers}
					pageSize={pageSize}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					fetching={fetching}
					error={error}
				/>

				{pagedSubscribers && pagedSubscribers.length > 0 && (
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-2">
							{/* Prev */}
							<button
								onClick={() => {
									setCurrentPage((p) => Math.max(p - 1, 1));
									document
										.getElementById('subscribers-section')
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
										<span key={`dots-${idx}`} className="px-2">
											…
										</span>
									) : (
										<button
											key={`page-${page}-${idx}`}
											onClick={() => {
												setCurrentPage(page as number);
												document
													.getElementById('subscribers-section')
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
										.getElementById('subscribers-section')
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
			</div>
		</div>
	);
};

export default SubscriptionsPage;

