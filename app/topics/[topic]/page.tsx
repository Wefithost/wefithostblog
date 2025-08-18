'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArticlesContainer from '~/app/components/articles-container/articles-container';
import EmptyState from '~/app/components/empty-state';
import HeroPreview from '~/app/components/hero-preview';
import Loader from '~/app/components/loader';
import RelatedTopicsSection from '~/app/components/related-topics';
import { useTopicsContext } from '~/app/context/topics-context';
import { IArticle } from '~/types/article';
import { apiRequest } from '~/utils/api-request';
import { slugify } from '~/utils/slugify';
interface topicProps {
	articles: IArticle[];
	title: string;
	desc: string;
}

export default function Topic() {
	const { topic } = useParams();
	const { topics } = useTopicsContext();

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<topicProps | null>(null);
	const [totalArticles, setTotalArticles] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPage = async () => {
			setFetching(true);
			setError('');

			await apiRequest({
				url: `/api/topics/${topic}?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}`,
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

		fetchPage();
	}, [currentPage, topic]);
	const other_topics = topics?.filter((type) => slugify(type?.title) !== topic);

	return (
		<main className="  mx-auto px-16 max-2xl:px-10 max-xs:px-5 w-full">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 ">
				<Loader fetching={fetching} error={error}>
					{pagedArticles && pagedArticles.articles?.length > 0 ? (
						<>
							<HeroPreview articles={pagedArticles?.articles} />
							<section className="flex flex-col gap-4 max-w-[900px]">
								<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl capitalize">
									{pagedArticles?.title}
								</h1>
								<p className="text-lg max-2xl:text-base">
									{pagedArticles?.desc}
								</p>
							</section>
							<ArticlesContainer
								pagedArticles={pagedArticles?.articles}
								showFilters={false}
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

				{other_topics && other_topics?.length > 0 && (
					<>
						<RelatedTopicsSection
							header="Check out our other topics"
							related_topics={other_topics}
						/>
					</>
				)}
				{/* CTA Section */}
				{/* <CtaSection /> */}
			</div>
		</main>
	);
}

