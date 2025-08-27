import connectMongo from '~/lib/connect-mongo';
import Topic from '~/lib/models/topic';

export async function getTopic(topic: string) {
	await connectMongo();
	return Topic.findOne({ slug: topic }).lean();
}

