'use client';
import { useFetch } from '~/utils/fetch-page-data';
import ArticlesContainer from './components/articles-container';
import CtaSection from './components/cta';
import HeroPreview from './components/hero-preview';
import { IArticle } from '~/types/article';
import Loader from './components/loader';
import EmptyState from './components/empty-state';
import { useTopicsContext } from './context/topics-context';
import RelatedTopicsSection from './components/related-topics';

export default function Home() {
	const {
		fetchedData: articles,
		isFetching,
		error,
	} = useFetch<IArticle[]>({
		basePath: `/api/fetch-articles`,
		ids: [],
	});
	const { topics } = useTopicsContext();
	return (
		<main className="mx-auto  w-full">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 mx-auto   max-2xl:px-10 max-xs:px-5">
				<Loader fetching={isFetching} error={error}>
					{articles && articles?.length > 0 ? (
						<>
							<HeroPreview articles={articles} />
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
							<ArticlesContainer articles={articles} />
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

