import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';

export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);
		const adminId = searchParams.get('adminId');
		const skip = parseInt(searchParams.get('skip') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '10', 10);

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{
					error: 'Invalid or missing admin ID',
				},
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

		const members = await User.aggregate([
			{
				$addFields: {
					rolePriority: {
						$switch: {
							branches: [
								{ case: { $eq: ['$role', 'super_admin'] }, then: 2 },
								{ case: { $eq: ['$role', 'admin'] }, then: 1 },
							],
							default: 0,
						},
					},
				},
			},
			{ $sort: { rolePriority: -1, createdAt: -1 } }, // super_admin first, then admin, then others
			{ $skip: skip },
			{ $limit: limit },
		]);
		const membersLength = await User.countDocuments({});
		return NextResponse.json(
			{ members, members_length: membersLength },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				error: 'Could not fetch members data',
			},
			{ status: 500 },
		);
	}
}

