import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import Topic from '~/lib/models/topic';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';

export async function DELETE(req: NextRequest) {
	try {
		await connectMongo();

		const { topicId, adminId } = await req.json();

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(topicId)) {
			return NextResponse.json(
				{ error: 'Topic Id not provided or invalid' },
				{ status: 400 },
			);
		}

		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account found with this Id' },
				{ status: 404 },
			);
		}

		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		const existingTopic = await Topic.findByIdAndDelete(topicId);
		await Article.deleteMany({ topic: topicId });
		await Alert.create({
			type: 'topic_deleted',
			message: `delete a topic: '${existingTopic?.title}'`,
			triggered_by: admin._id,

			status: 'delete',
		});
		if (!existingTopic) {
			return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ message: 'Topic deleted successfully' },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

