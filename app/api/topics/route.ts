import { NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Topic from '~/lib/models/topic';

export async function GET() {
	try {
		await connectMongo();

		// Fetch topics sorted by latest first
		const topics = await Topic.find().sort({ createdAt: -1 });

		return NextResponse.json({ response: topics }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch topics' },
			{ status: 500 },
		);
	}
}

