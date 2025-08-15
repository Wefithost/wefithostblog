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

		const articles = await Article.find({ topic: existingTopic._id })
			.populate({
				path: 'topic',
				select: 'title',
			})
			.populate({
				path: 'author',
				select: 'profile first_name last_name',
			});

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

