import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
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

		if (!isValidObjectId(userId)) {
			return NextResponse.json(
				{
					error: 'User Id not provided',
				},
				{ status: 403 },
			);
		}

		const user = await User.findById(userId);
		const isBlocked = await Blocked.findOne({ ip_address: ip });
		if (isBlocked) {
			return NextResponse.json(
				{ error: 'This IP address has already being blocked' },
				{ status: 403 },
			);
		}
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
			reason: reason ? reason : null,
			blocked_by: userId,
		});
		await Alert.create({
			type: 'ip_blocked',
			message: `blocked an ip: ${ip}`,
			triggered_by: userId,
			status: 'delete',
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

