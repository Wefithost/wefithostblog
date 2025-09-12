import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import '~/lib/models/user';
export async function getArticle(article: string) {
	await connectMongo();
	return Article.findOne({ slug: article })
		.populate({ path: 'author', select: 'first_name last_name' })
		.lean();
}

