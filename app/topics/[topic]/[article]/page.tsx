import { getArticle } from '~/utils/getArticle';
import Article from './article';
import { Metadata } from 'next';

type Props = {
	params: Promise<{
		topic: string;
		article: string;
	}>;
};
// Generate metadata dynamically for SEO + sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const articleParam = await params;
	const article = await getArticle(articleParam?.article);

	if (!article) {
		return {
			title: 'Article not found',
			description: 'This article does not exist.',
		};
	}

	const url = `https://blog.wefithost.com/${articleParam?.topic}/${articleParam?.article}`;

	return {
		title: article.title,
		description: article.description,
		openGraph: {
			title: article.title,
			description: article.description,
			url,
			images: [
				{
					url: article.image,
					width: 1200,
					height: 630,
					alt: article.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: article.title,
			description: article.description,
			images: [article.image],
		},
	};
}
const ArticlePage = () => {
	return <Article />;
};

export default ArticlePage;

