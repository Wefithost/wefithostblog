'use client';
import { useParams } from 'next/navigation';
import ArticlesContainer from '~/app/components/articles-container';
import EmptyState from '~/app/components/empty-state';
import HeroPreview from '~/app/components/hero-preview';
import Loader from '~/app/components/loader';
import RelatedTopicsSection from '~/app/components/related-topics';
import { useTopicsContext } from '~/app/context/topics-context';
import { IArticle } from '~/types/article';
import { useFetch } from '~/utils/fetch-page-data';
import { slugify } from '~/utils/slugify';
interface topicProps {
	articles: IArticle[];
	title: string;
	desc: string;
}
export default function Topic() {
	const { topic } = useParams();
	const { topics } = useTopicsContext();
	const {
		fetchedData: topic_data,
		isFetching,
		error,
	} = useFetch<topicProps>({
		basePath: `/api/topics/${topic}`,
		ids: [],
		dataKey: 'topicDetails',
	});
	const other_topics = topics?.filter((type) => slugify(type?.title) !== topic);

	return (
		<main className="  mx-auto px-16 max-2xl:px-10 max-xs:px-5 w-full">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 ">
				<Loader fetching={isFetching} error={error}>
					{topic_data?.articles && topic_data.articles?.length > 0 ? (
						<>
							<HeroPreview articles={topic_data?.articles} />
							<section className="flex flex-col gap-4 max-w-[900px]">
								<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl capitalize">
									{topic_data?.title}
								</h1>
								<p className="text-lg max-2xl:text-base">{topic_data?.desc}</p>
							</section>
							<ArticlesContainer
								articles={topic_data?.articles}
								showFilters={false}
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

