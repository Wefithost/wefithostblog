'use client';

import { useParams } from 'next/navigation';
import { IArticle } from '~/types/article';
import Loader from '~/app/components/loader';
import ArticleCard from '~/app/components/cards/article-card/article-card';
import { useAuthContext } from '~/app/context/auth-context';

import NewArticle from '../../components/new-article';
import { useFetch } from '~/utils/fetch-page-data';
import EmptyState from '~/app/components/empty-state';
const Articles = () => {
	const { topic } = useParams();
	const { user, loading } = useAuthContext();
	interface topicProps {
		articles: IArticle[];
		title: string;
		desc: string;
	}
	const {
		fetchedData: topic_data,
		isFetching,
		error,
		refetch,
	} = useFetch<topicProps>({
		basePath: `/api/topics/${topic}?`,
		ids: [],
		eventKey: 'articlesUpdated',
		enabled: !!user && !loading,
		dataKey: 'topicDetails',
		//  deps:[loading,user]
	});

	return (
		<main className="px-4 py-6 bg-white min-h-screen flex flex-col gap-16 ">
			<div className="flex items-center justify-between w-full">
				<div className="flex flex-col gap-3">
					<h1 className="text-3xl font-semibold">All Articles in {topic}</h1>
					<p className="text-base max-w-[600px]">
						Manage all your articles in one place—edit, publish, or delete with
						ease to keep your content fresh and organized.
					</p>
				</div>
				<NewArticle />
			</div>
			<Loader fetching={isFetching} error={error} try_again={refetch}>
				{topic_data?.articles && topic_data?.articles.length > 0 ? (
					<div className="grid grid-cols-3  gap-4">
						{topic_data?.articles.map((article) => (
							<ArticleCard article={article} key={article?._id} admin={true} />
						))}
					</div>
				) : (
					<EmptyState message="No article has been created for this topic" />
				)}
			</Loader>
		</main>
	);
};

export default Articles;

