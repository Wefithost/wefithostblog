/** @type {import('next-sitemap').IConfig} */
const config = {
	siteUrl: 'https://blog.wefithost.com', // your domain
	generateRobotsTxt: true, // also generate robots.txt
	changefreq: 'weekly',
	priority: 0.7,
	sitemapSize: 5000,

	additionalPaths: async (config) => {
		// Connect to MongoDB
		const { default: connectMongo } = await import('./lib/connect-mongo');
		const { default: Article } = await import('./lib/models/article');

		await connectMongo();

		// Fetch all published articles
		const articles = await Article.find({ published: true })
			.populate({ path: 'topic', select: 'slug' })
			.lean();

		// Build unique topic list (just slugs)
		const uniqueTopics = [...new Set(articles.map((a) => a.topic.slug))];

		// Map articles to sitemap entries
		const articlePaths = articles.map((article) => ({
			loc: `/topics/${article.topic.slug}/${article.slug}`,
			changefreq: 'weekly',
			priority: 0.8,
		}));

		// Map topic pages to sitemap entries
		const topicPaths = uniqueTopics.map((topicSlug) => ({
			loc: `/topics/${topicSlug}`,
			changefreq: 'weekly',
			priority: 0.6,
		}));

		return [...articlePaths, ...topicPaths];
	},
};

export default config;
