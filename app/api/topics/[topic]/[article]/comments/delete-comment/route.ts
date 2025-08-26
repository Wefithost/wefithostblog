import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import Article from '~/lib/models/article';
import CommentModel from '~/lib/models/comments';
import Topic from '~/lib/models/topic';
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ topic: string; article: string }> },
) {
	try {
		await connectMongo();
		const { topic, article } = await params;
		const { userId, commentId } = await req.json();

		if (!isValidObjectId(commentId)) {
			return NextResponse.json(
				{ error: 'Invalid Comment Id' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(userId)) {
			return NextResponse.json({ error: 'Invalid User Id' }, { status: 400 });
		}

		if (!topic.trim()) {
			return NextResponse.json(
				{ error: 'Topic not provided' },
				{ status: 400 },
			);
		}

		if (!article.trim()) {
			return NextResponse.json(
				{ error: 'Article not provided' },
				{ status: 400 },
			);
		}

		const selectedTopic = await Topic.findOne({ slug: topic });
		if (!selectedTopic) {
			return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
		}

		const existingArticle = await Article.findOne({ slug: article });
		if (!existingArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		const existingComment = await CommentModel.findByIdAndDelete(commentId);

		await CommentModel.deleteMany({ parent_id: commentId });
		await Alert.create({
			type: 'comment_deleted',
			message: `deleted a comment: ${existingComment?.comment}`,
			triggered_by: userId,
			status: 'delete',
		});
		if (!existingComment) {
			return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ message: 'Comment deleted successfully' },
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

