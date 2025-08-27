/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://blog.wefithost.com',
	generateRobotsTxt: true, // Automatically generates robots.txt
	sitemapSize: 5000, // (optional) split sitemaps if huge site
	changefreq: 'daily',
	priority: 1,
	exclude: ['/admin/*'], // Pages or patterns to skip
	robotsTxtOptions: {
		policies: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
	},
};
