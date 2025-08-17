import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import Topic from '~/lib/models/topic';

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
		console.log('topic', topic);
		if (topic.trim() === '') {
			return NextResponse.json(
				{
					error: 'Topic not provided or invalid',
				},
				{ status: 400 },
			);
		}

		const existingTopic = await Topic.findOne({ slug: topic });
		if (!existingTopic) {
			return NextResponse.json(
				{ error: 'No topic was found with this title' },
				{ status: 404 },
			);
		}
		let articles;
		if (admin) {
			articles = await Article.find({})

				.populate({
					path: 'topic',
					select: 'title',
				})
				.populate({
					path: 'author',
					select: 'profile first_name last_name',
				})
				.lean();
		} else {
			articles = await Article.find({ published: true })

				.populate({
					path: 'topic',
					select: 'title',
				})
				.populate({
					path: 'author',
					select: 'profile first_name last_name',
				})
				.lean();
		}

		const topicDetails = {
			title: existingTopic.title,
			desc: existingTopic.description,
			articles,
		};
		return NextResponse.json(
			{
				topicDetails,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

