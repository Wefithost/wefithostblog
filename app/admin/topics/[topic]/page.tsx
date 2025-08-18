'use client';

import { useParams } from 'next/navigation';
import { IArticle } from '~/types/article';
import Loader from '~/app/components/loader';
import { useAuthContext } from '~/app/context/auth-context';

import NewArticle from '../../components/new-article';
import EmptyState from '~/app/components/empty-state';
import ArticlesContainer from '~/app/components/articles-container/articles-container';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import Breadcrumbs from '../../components/bread-crumbs';
const Articles = () => {
	const { topic } = useParams();
	const { user } = useAuthContext();
	interface topicProps {
		articles: IArticle[];
		title: string;
		desc: string;
	}

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<topicProps | null>(null);
	const [totalArticles, setTotalArticles] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!user) {
			return;
		}
		const fetchPage = async () => {
			setFetching(true);
			setError('');

			await apiRequest({
				url: `/api/topics/${topic}?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&admin=true`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedArticles(res.topicDetails);
					setTotalArticles(res.totalArticles);
				},
				onError: (error) => {
					setError(error);
				},
				onFinally: () => {
					setFetching(false);
				},
			});
		};
		const refetchHandler = () => fetchPage();
		window.addEventListener('refetchArticles', refetchHandler);
		fetchPage();
		return () => window.removeEventListener('refetchArticles', refetchHandler);
	}, [currentPage, topic, user]);
	return (
		<main className="px-4 py-6 bg-white min-h-screen flex flex-col gap-8 ">
			{/* <Breadcrumbs /> */}
			<div className="flex items-start justify-between w-full">
				<div className="flex flex-col gap-3">
					<h1 className="max-xs:text-2xl capitalize  text-3xl font-semibold">
						All Articles in {pagedArticles?.title}
					</h1>
					<p className="text-base max-w-[600px]">
						Manage all your articles in one place—edit, publish, or delete with
						ease to keep your content fresh and organized.
					</p>
				</div>
				<NewArticle />
			</div>
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 ">
				<Loader fetching={fetching} error={error}>
					{pagedArticles?.articles && pagedArticles.articles?.length > 0 ? (
						<>
							<ArticlesContainer
								pagedArticles={pagedArticles?.articles}
								showFilters={false}
								query={'admin=true'}
								admin={true}
								totalArticles={totalArticles}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								pageSize={pageSize}
							/>
						</>
					) : (
						<EmptyState message="No articles has been created for this topic yet" />
					)}
				</Loader>

				{/* CTA Section */}
				{/* <CtaSection /> */}
			</div>
		</main>
	);
};

export default Articles;

