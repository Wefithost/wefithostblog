import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import Topic from '~/lib/models/topic';
import { getReadingTime } from '~/utils/get-reading-time';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ topic: string }> },
) {
	try {
		await connectMongo();
		const { topic } = await params;
		const { searchParams } = new URL(req.url);

		const adminParam = searchParams.get('admin');
		const admin = adminParam ? adminParam === 'true' : false;
		const skip = parseInt(searchParams.get('skip') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '9', 10);

		const sortOrder = searchParams.get('sort') === 'oldest' ? 1 : -1;
		const search = searchParams.get('search') || '';

		if (!topic || topic.trim() === '') {
			return NextResponse.json(
				{ error: 'Topic not provided or invalid' },
				{ status: 400 },
			);
		}

		const existingTopic = await Topic.findOne({ slug: topic });
		if (!existingTopic) {
			return NextResponse.json(
				{ error: `No topic was found with the name: '${topic}'` },
				{ status: 404 },
			);
		}

		// eslint-disable-next-line
		let filter: any = { topic: existingTopic._id };
		if (!admin) {
			filter.published = true;
		}
		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		// 🔹 Fetch articles
		const rawArticles = await Article.find(filter)
			.skip(skip)
			.limit(limit)
			.populate({ path: 'topic', select: 'title' })
			.populate({ path: 'author', select: 'profile first_name last_name' })
			.sort({ createdAt: sortOrder })
			.lean();
		const articles = rawArticles.map((article) => {
			const duration = getReadingTime(article.article || '');
			return {
				...article,
				duration,
				article: undefined, // don’t return full article text
			};
		});

		const totalArticles = await Article.countDocuments(filter);

		// 🔹 Response payload
		const topicDetails = {
			title: existingTopic.title,
			desc: existingTopic.description,
			articles,
			totalArticles,
		};

		return NextResponse.json({ topicDetails }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

