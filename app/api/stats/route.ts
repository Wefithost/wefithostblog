import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import User from '~/lib/models/user';

export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);

		const adminId = searchParams.get('adminId');

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'AdminId not provided or invalid' },
				{ status: 400 },
			);
		}

		const member = await User.findById(adminId);

		if (!member) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}

		const isAdmin = member.role === 'admin' || member.role === 'super_admin';

		if (!isAdmin) {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 405 },
			);
		}

		// ✅ Total members
		const totalMembers = await User.countDocuments({});

		// ✅ Members subscribed today
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const memberSubscribedToday = await User.countDocuments({
			createdAt: { $gte: startOfDay, $lte: endOfDay },
		});

		// total-articles
		const totalArticles = await Article.countDocuments({});

		const articleCreatedToday = await Article.countDocuments({
			createdAt: { $gte: startOfDay, $lte: endOfDay },
		});

		const stats = {
			totalMembers,
			memberSubscribedToday,
			totalArticles,
			articleCreatedToday,
		};
		return NextResponse.json({
			stats,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

