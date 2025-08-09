import { IArticle } from '~/types/article';
import ArticleCard from './cards/article-card';
import { useMemo } from 'react';

interface RelatedProps {
	header?: string;
	related_articles: IArticle[];
}

const RelatedArticlesSection = ({ header, related_articles }: RelatedProps) => {
	const shuffledArticles = useMemo(() => {
		if (!related_articles) return [];
		const copy = [...related_articles];
		return copy.sort(() => Math.random() - 0.5).slice(0, 3);
		// eslint-disable-next-line
	}, []);

	return (
		<aside className="flex w-full flex-col gap-5 max-2xl:gap-4  py-10 ">
			{header && (
				<h3 className="text-[28px] poppins-bold max-xl:text-xl">{header}</h3>
			)}
			<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col  max-xl:grid-cols-2 max-dmd:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2 ">
				{shuffledArticles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</div>
		</aside>
	);
};

export default RelatedArticlesSection;

