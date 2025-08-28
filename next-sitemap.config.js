/** @type {import('next-sitemap').IConfig} */
const config = {
	siteUrl: 'https://blog.wefithost.com',
	generateRobotsTxt: true,
	changefreq: 'weekly',
	priority: 0.7,
	sitemapSize: 5000,

	additionalPaths: async (cfg) => {
		// Use relative paths (no TS path aliases) since this runs in Node
		const { default: connectMongo } = await import('./lib/connect-mongo');
		const { default: Article } = await import('./lib/models/article');

		await connectMongo();

		// Fetch all published articles and populate topic slug
		const articles = await Article.find({ published: true })
			.populate({ path: 'topic', select: 'slug' })
			.lean();

		// Unique topic slugs (filter out missing)
		const uniqueTopics = [
			...new Set((articles || []).map((a) => a?.topic?.slug).filter(Boolean)),
		];

		// Article URLs
		const articlePaths = (articles || [])
			.filter((a) => a?.topic?.slug && a?.slug)
			.map((article) => ({
				loc: `/topics/${article.topic.slug}/${article.slug}`,
				changefreq: 'weekly',
				priority: 0.8,
			}));

		// Topic URLs
		const topicPaths = uniqueTopics.map((topicSlug) => ({
			loc: `/topics/${topicSlug}`,
			changefreq: 'weekly',
			priority: 0.6,
		}));

		return [...articlePaths, ...topicPaths];
	},
};

module.exports = config;

