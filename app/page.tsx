'use client';
import ArticlesContainer from './components/articles-container/articles-container';
import CtaSection from './components/cta';
import HeroPreview from './components/hero-preview';
import { IArticle } from '~/types/article';
import Loader from './components/loader';
import EmptyState from './components/empty-state';
import { useTopicsContext } from './context/topics-context';
import RelatedTopicsSection from './components/related-topics';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';

export default function Home() {
	const { topics } = useTopicsContext();

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<IArticle[]>([]);
	const [totalArticles, setTotalArticles] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPage = async () => {
			setFetching(true);
			setError('');
			await apiRequest({
				url: `/api/fetch-articles?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedArticles(res.response);
					setTotalArticles(res.articlesLength);
				},
				onError: (error) => {
					setError(error);
				},
				onFinally: () => {
					setFetching(false);
				},
			});
		};

		fetchPage();
	}, [currentPage]);
	return (
		<main className="mx-auto  w-full">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 mx-auto   max-2xl:px-10 max-xs:px-5">
				<Loader fetching={fetching} error={error}>
					{pagedArticles && pagedArticles?.length > 0 ? (
						<>
							<HeroPreview articles={pagedArticles} />
							<section className="flex flex-col gap-4 max-w-[1500px]  w-full">
								<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl ">
									WeFitHost Blog
								</h1>
								<p className="text-lg max-2xl:text-base">
									WeFitHost Blog brings you the latest tips, updates, and
									insights on web hosting, website management, and digital tools
									— helping individuals and businesses build faster, smarter,
									and more secure online experiences
								</p>
							</section>
							<ArticlesContainer
								pagedArticles={pagedArticles}
								totalArticles={totalArticles}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								pageSize={pageSize}
							/>
						</>
					) : (
						<EmptyState message="No articles has been created yet" />
					)}
				</Loader>
				{/* CTA Section */}

				{topics && topics?.length > 0 && (
					<>
						<RelatedTopicsSection
							header="Explore Topics"
							related_topics={topics}
						/>
					</>
				)}
			</div>
			<CtaSection />
		</main>
	);
}

