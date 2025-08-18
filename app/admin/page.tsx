// 'use client';
// import Image from 'next/image';
// import wave from '~/public/images/waving-hand-medium-light-skin-tone-svgrepo-com.svg';
// import { useAuthContext } from '../context/auth-context';
// import { user_type } from '~/types/user';
// import { articles } from '~/lib/data/articles';
// import { useEffect, useState } from 'react';
// import { apiRequest } from '~/utils/api-request';
// import { IArticle } from '~/types/article';
// import { toast } from 'react-toastify';

// const Admin = () => {
// 	const { user, loading } = useAuthContext();
// 	const [users, setUsers] = useState<user_type[] | null>(null);
// 	const [fetchingUsers, setFetchingUsers] = useState(true);
// 	const [fetchingUsersError, setFetchingUsersError] = useState('');
// 	useEffect(() => {
// 		const fetchUsers = async () => {
// 			if (loading) {
// 				return;
// 			}
// 			if (user?.role === 'member') {
// 				return;
// 			}
// 			setFetchingUsers(true);
// 			setFetchingUsersError('');
// 			await apiRequest({
// 				url: `/api/fetch-members?adminId=${user?._id}`,
// 				method: 'GET',
// 				onSuccess: (res) => {
// 					setUsers(res.members);
// 				},
// 				onError: (error) => {
// 					setFetchingUsersError(error);
// 					toast.error(fetchingUsersError);
// 				},
// 				onFinally: () => {
// 					setFetchingUsers(false);
// 				},
// 			});
// 		};

// 		fetchUsers();
// 	}, []);
// 	const today = new Date().toISOString().split('T')[0];
// 	const calculateTotalMembersStats = (users: user_type[] | null) => {
// 		let usersSubscribedToday = 0;
// 		users?.forEach((user) => {
// 			//@ts-expect-error it's a string
// 			if (user?.createdAt?.startsWith(today)) {
// 				usersSubscribedToday++;
// 			}
// 		});

// 		return {
// 			usersSubscribedToday,
// 		};
// 	};
// 	const calculateTotalArticlesStats = (articles: IArticle[] | null) => {
// 		let articlesCreatedToday = 0;
// 		articles?.forEach((article) => {
// 			//@ts-expect-error it's a string
// 			if (article?.createdAt?.startsWith(today)) {
// 				articlesCreatedToday++;
// 			}
// 		});

// 		return {
// 			articlesCreatedToday,
// 		};
// 	};
// 	const usersStats = calculateTotalMembersStats(users);
// 	const blogStats = calculateTotalArticlesStats(articles);
// 	if (loading) {
// 		return 'loading';
// 	}

// 	return (
// 		<div className="text-2xl flex flex-col w-full   py-8">
// 			<div className="flex flex-col gap-4  items-start w-full px-4 ">
// 				<div>
// 					<h1 className="neue-light  text-black  text-xl flex items-center gap-2 max-sm:text-xl">
// 						<Image src={wave} alt="" className="w-5" />
// 						<span>Welcome back, {user?.first_name}</span>
// 					</h1>
// 					{/* <h1 className="neue-light   text-sm text-grey ">
//                   These are the latest updates for the last 7 days.
//                </h1> */}
// 				</div>
// 				<div className=" grid grid-cols-3      justify-between  rounded-[40px]  w-full gap-3 max-sm:grid-cols-2 max-2xs:grid-cols-1">
// 					<div className=" p-5  rounded-lg bg-white  flex flex-col gap-2 items-start  w-full  max-md:p-2">
// 						<h1 className="text-sm text-grey  leading-none ">Total Articles</h1>
// 						<h1 className="text-3xl neue-light ">{articles.length}</h1>
// 						{blogStats.articlesCreatedToday > 0 ? (
// 							<div className="bg-[#ECFCF3]   text-softGreen  px-3 py-1 rounded-full text-xs neue-light  ">
// 								{blogStats.articlesCreatedToday.toLocaleString('en-US')}{' '}
// 								{blogStats.articlesCreatedToday > 1 ? 'articles' : 'article'}
// 								created today
// 							</div>
// 						) : (
// 							<div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs neue-light  ">
// 								No articles created today
// 							</div>
// 						)}
// 					</div>

// 					<div className=" p-5  rounded-lg bg-white  flex flex-col gap-2 items-start  w-full  max-md:p-2">
// 						<h1 className="text-sm text-grey  leading-none ">Total Users</h1>
// 						<h1 className="text-3xl neue-light ">{users?.length}</h1>
// 						{usersStats.usersSubscribedToday > 0 ? (
// 							<div className="bg-[#ECFCF3]   text-softGreen  px-3 py-1 rounded-full text-xs neue-light  ">
// 								{usersStats.usersSubscribedToday.toLocaleString('en-US')}{' '}
// 								{usersStats.usersSubscribedToday > 1 ? 'users' : 'user'}{' '}
// 								subscribed today
// 							</div>
// 						) : (
// 							<div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs neue-light  ">
// 								No users subscribed today
// 							</div>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Admin;

const Admin = () => {
	return <h1>Populating Here Soon</h1>;
};

export default Admin;

