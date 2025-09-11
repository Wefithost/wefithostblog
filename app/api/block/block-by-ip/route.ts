import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Blocked from '~/lib/models/blocked';
import User from '~/lib/models/user';

export async function POST(req: NextRequest) {
	try {
		await connectMongo();
		const { ip, userId, reason } = await req.json();

		if (!ip || ip.trim() === '') {
			return NextResponse.json(
				{ error: 'An Ip address for the comment was not provided' },
				{ status: 403 },
			);
		}

		if (!reason || reason.trim() === '') {
			return NextResponse.json(
				{ error: 'A reason for blocking was not provided' },
				{ status: 403 },
			);
		}

		if (!isValidObjectId(userId)) {
			return NextResponse.json(
				{
					error: 'User Id not provided',
				},
				{ status: 403 },
			);
		}

		const user = await User.findById(userId);

		if (!user) {
			return NextResponse.json(
				{
					error: 'No account was found with this Id',
				},
				{ status: 405 },
			);
		}

		const isAdmin = user.role === 'super_admin';

		if (!isAdmin) {
			return NextResponse.json(
				{
					error: 'Only Super admins are allowed to perform this action',
				},
				{ status: 405 },
			);
		}

		await Blocked.create({
			ip_address: ip,
			reason: reason,
			blocked_by: userId,
		});

		return NextResponse.json(
			{
				message: 'I.P Address blocked successfully',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				error: 'A server error occurred',
			},
			{ status: 500 },
		);
	}
}

