import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import Topic from '~/lib/models/topic';

export async function getTopic(topic: string) {
	await connectMongo();

	const selectedTopic = await Topic.findOne({ slug: topic }).lean();
	if (!selectedTopic) return null;

	const articles = await Article.find({ topic: selectedTopic._id })
		.populate({ path: 'author', select: 'first_name last_name' })
		.lean()
		.limit(6);

	return { ...selectedTopic, articles };
}

