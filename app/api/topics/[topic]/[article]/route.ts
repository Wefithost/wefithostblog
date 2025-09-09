import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import Topic from '~/lib/models/topic';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ topic: string; article: string }> },
) {
	try {
		await connectMongo();
		const { topic, article } = await params;
		if (topic.trim() === '') {
			return NextResponse.json(
				{
					error: 'Topic not provided or invalid',
				},
				{ status: 405 },
			);
		}

		const existingTopic = await Topic.findOne({ slug: topic });
		if (!existingTopic) {
			return NextResponse.json(
				{ error: 'No topic was found with this title' },
				{ status: 404 },
			);
		}

		const selectedArticle = await Article.findOne({ slug: article })
			.populate({
				path: 'topic',
				select: 'title',
			})
			.populate({
				path: 'author',
				select: 'profile first_name last_name bio',
			});

		if (!selectedArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				selectedArticle,
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

