import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';

export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);
		const adminParam = searchParams.get('admin');
		const admin = adminParam ? adminParam === 'true' : false;
		const skip = parseInt(searchParams.get('skip') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '9', 10);
		let articles;
		if (admin) {
			articles = await Article.find({})
				.skip(skip)
				.limit(limit)
				.populate({
					path: 'topic',
					select: 'title',
				})
				.populate({
					path: 'author',
					select: 'profile first_name last_name',
				})
				.sort({ createdAt: -1 })
				.select('')
				.lean();
		} else {
			articles = await Article.find({ published: true })
				.skip(skip)
				.limit(limit)
				.populate({
					path: 'topic',
					select: 'title',
				})
				.populate({
					path: 'author',
					select: 'profile first_name last_name',
				})
				.sort({ createdAt: -1 })
				.lean();
		}

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

