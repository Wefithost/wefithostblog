import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';

export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);
		const adminParam = searchParams.get('admin');
		const admin = adminParam ? adminParam === 'true' : false;
		let articles;
		if (admin) {
			articles = await Article.find({})
				.limit(9)
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
			articles = await Article.find({ published: true, featured: true })
				.limit(9)
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
		console.log(articles);
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

