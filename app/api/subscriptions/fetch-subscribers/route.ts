import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';
import User from '~/lib/models/user';
export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);

		const adminId = searchParams.get('adminId');
		const skip = parseInt(searchParams.get('skip') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '10', 10);
		const search = searchParams.get('search') || '';

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Invalid or missing admin ID' },
				{ status: 400 },
			);
		}

		const user = await User.findById(adminId);
		if (!user) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}

		if (user.role === 'subscriber') {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 403 },
			);
		}

		// 🔍 Build search filter
		let matchStage = {};
		if (search) {
			matchStage = {
				$or: [{ email: { $regex: search, $options: 'i' } }],
			};
		}

		// 📨 Get subscribers with pagination
		const subscribers = await NewsletterSubscription.find(matchStage)
			.limit(limit)
			.skip(skip);

		// 📊 Total count (fixed to count NewsletterSubscription)
		const subscribersLength = await NewsletterSubscription.countDocuments(
			matchStage,
		);

		// 🧠 Check if subscriber email exists in User collection
		const emails = subscribers.map((s) => s.email);
		const users = await User.find({ email: { $in: emails } }, 'email role');

		// Create a map of email -> role for quick lookup
		const userRoleMap = new Map(users.map((u) => [u.email, u.role]));

		// 🧩 Merge user role into subscribers
		const mergedSubscribers = subscribers.map((s) => ({
			_id: s._id,
			email: s.email,
			//@ts-expect-error: we know
			createdAt: s.createdAt,
			role: userRoleMap.get(s.email) || 'subscriber',
		}));

		return NextResponse.json(
			{
				subscribers: mergedSubscribers,
				subscribers_length: subscribersLength,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log('Error fetching subscribers:', error);
		return NextResponse.json(
			{ error: 'Could not fetch subscribers data' },
			{ status: 500 },
		);
	}
}

