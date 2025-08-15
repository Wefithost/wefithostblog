import { NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';

export async function GET() {
	try {
		await connectMongo();

		const articles = await Article.find({})
			.populate({
				path: 'topic',
				select: 'title',
			})
			.populate({
				path: 'author',
				select: 'profile first_name last_name',
			});
		const articlesLength = await Article.countDocuments({});
		return NextResponse.json(
			{ response: articles, articlesLength },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'A server error occured' },
			{ status: 500 },
		);
	}
}

