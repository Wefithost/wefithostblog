import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import Topic from '~/lib/models/topic';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ topic: string; article: string }> },
) {
	try {
		await connectMongo();

		const { topic, article } = await params;
		const { adminId } = await req.json();

		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		// Check admin
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}
		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Validate topic
		const selectedTopic = await Topic.findOne({ slug: topic });
		if (!selectedTopic) {
			return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
		}

		// Validate article
		const existingArticle = await Article.findOne({ slug: article });
		if (!existingArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		// Update article content
		existingArticle.featured = !existingArticle.featured;
		await existingArticle.save();

		const message = existingArticle.featured
			? 'Article featured successfully'
			: 'Article unfeatured successfully';
		await Alert.create({
			type: 'article_featured',
			message: `${
				existingArticle.featured ? 'featured' : 'unfeatured'
			} an article: ${existingArticle?.title}`,
			triggered_by: admin?._id,
			link: {
				url: `/topics/${selectedTopic?.slug}/${existingArticle?.slug}`,
				label: 'Edited article',
			},
			status: 'info',
		});
		return NextResponse.json(
			{
				message,
			},

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

