import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';

export async function getArticle(article: string) {
	await connectMongo();
	return Article.findOne({ slug: article })
		.lean()
		.populate({ path: 'author', select: 'first_name last_name' });
}

