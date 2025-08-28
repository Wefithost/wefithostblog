import { MetadataRoute } from 'next';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	await connectMongo();

	const articles = await Article.find({ published: true })
		.populate({ path: 'topic', select: 'slug' })
		.lean();

	const uniqueTopics = [
		...new Set((articles || []).map((a) => a?.topic?.slug).filter(Boolean)),
	];

	const articleUrls =
		(articles || [])
			.filter((a) => a?.topic?.slug && a?.slug)
			.map((article) => ({
				url: `https://blog.wefithost.com/topics/${article.topic.slug}/${article.slug}`,
				lastModified: new Date(article.updatedAt),
			})) ?? [];

	const topicUrls = uniqueTopics.map((slug) => ({
		url: `https://blog.wefithost.com/topics/${slug}`,
		lastModified: new Date(),
	}));

	return [
		{
			url: 'https://blog.wefithost.com',
			lastModified: new Date(),
		},
		...articleUrls,
		...topicUrls,
	];
}

