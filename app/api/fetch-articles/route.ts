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

		const sortOrder = searchParams.get('sort') === 'oldest' ? 1 : -1;
		const search = searchParams.get('search') || '';
		const filterParam = searchParams.get('filter') || 'all';
		// eslint-disable-next-line
		let filter: any = {};
		if (search) {
			filter = {
				$or: [
					{ title: { $regex: search, $options: 'i' } },
					{ description: { $regex: search, $options: 'i' } },
				],
			};
		}
		if (filterParam && filterParam !== 'all') {
			const topics = filterParam.split(',');
			if (topics.length > 1) {
				filter.topic = { $in: topics };
			} else {
				filter.topic = topics[0];
			}
		}
		const baseFilter = admin ? {} : { published: true };
		const finalFilter = { ...baseFilter, ...filter };

		const articles = await Article.find(finalFilter)
			.skip(skip)
			.limit(limit)
			.populate({ path: 'topic', select: 'title' })
			.populate({ path: 'author', select: 'profile first_name last_name' })
			.sort({ createdAt: sortOrder })
			.lean();

		const articlesLength = await Article.countDocuments(finalFilter);

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

