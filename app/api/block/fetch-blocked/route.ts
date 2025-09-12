import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Blocked from '~/lib/models/blocked';
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

		if (user.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 403 },
			);
		}

		//eslint-disable-next-line
		let matchStage: any = {};
		if (search) {
			matchStage = {
				$or: [
					{ ip_address: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
				],
			};
		}

		const blocked = await Blocked.aggregate([
			{ $match: matchStage }, // ✅ Apply search filter
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
			{
				$lookup: {
					from: 'users', // collection name of your users
					localField: 'blocked_by', // field in Blocked
					foreignField: '_id', // field in User
					as: 'blocked_by_user',
				},
			},
			{
				$lookup: {
					from: 'users', // collection name of your users
					localField: 'blocked', // field in Blocked
					foreignField: '_id', // field in User
					as: 'blocked_user',
				},
			},
			{
				$unwind: {
					path: '$blocked_by_user',
					preserveNullAndEmptyArrays: true, // keeps records even if blocked_by is null
				},
			},
			{
				$unwind: {
					path: '$blocked_user',
					preserveNullAndEmptyArrays: true, // keeps records even if blocked_by is null
				},
			},
			{
				$project: {
					ip_address: 1,
					reason: 1,
					createdAt: 1,
					blocked_by: {
						first_name: '$blocked_by_user.first_name',
						last_name: '$blocked_by_user.last_name',
					},
					blocked: {
						email: '$blocked_user.email',
					},
				},
			},
		]);

		// count matches too
		const blockedLength = await Blocked.countDocuments(matchStage);

		return NextResponse.json(
			{ blocked, blocked_length: blockedLength },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'Could not fetch blocked data' },
			{ status: 500 },
		);
	}
}

