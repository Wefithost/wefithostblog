import { getArticle } from '~/utils/getArticle';
import Article from './article';
import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
	params: { topic: string; article: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { topic, article } = params;
	const articleDoc = await getArticle(article);

	if (!articleDoc) {
		return {
			title: 'Article not found',
			description: 'This article does not exist.',
		};
	}

	const url = `https://blog.wefithost.com/topics/${topic}/${article}`;

	return {
		title: articleDoc.title,
		description: articleDoc.description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: articleDoc.title,
			description: articleDoc.description,
			url,
			images: [
				{
					url: articleDoc.image
						? articleDoc.image.replace('/upload/', '/upload/f_jpg/')
						: 'https://blog.wefithost.com/default-image.jpg',
					width: 1200,
					height: 630,
					alt: articleDoc.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: articleDoc.title,
			description: articleDoc.description,
			images: [
				articleDoc.image || 'https://blog.wefithost.com/default-image.jpg',
			],
		},
	};
}

export default async function ArticlePage({ params }: Props) {
	const { topic, article } = params;
	const articleDoc = await getArticle(article);

	if (!articleDoc) return <Article />;

	const url = `https://blog.wefithost.com/topics/${topic}/${article}`;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: articleDoc.title,
		description: articleDoc.description,
		image: articleDoc.image,
		author: {
			'@type': 'Person',
			name: articleDoc.author
				? //@ts-expect-error: type string
				  `${articleDoc.author.first_name} ${articleDoc.author.last_name || ''}`
				: 'Unknown',
		},
		publisher: {
			'@type': 'Organization',
			name: 'WefitHost Blog',
			logo: {
				'@type': 'ImageObject',
				url: 'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756039608/logo_hdvqjb_1_1_u8ljxj.png',
			},
		},
		//@ts-expect-error: type date
		datePublished: articleDoc.createdAt,
		//@ts-expect-error: type date
		dateModified: articleDoc.updatedAt || articleDoc.createdAt,
	};

	return (
		<>
			<Article />
			<Script
				id="structured-data-article"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}

