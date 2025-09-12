import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import Blocked from '~/lib/models/blocked';
import User from '~/lib/models/user';

export async function POST(req: NextRequest) {
	try {
		await connectMongo();
		const { memberId, adminId, reason } = await req.json();

		if (!isValidObjectId(memberId)) {
			return NextResponse.json(
				{
					error: 'Member Id not provided',
				},
				{ status: 403 },
			);
		}

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{
					error: 'Member Id not provided',
				},
				{ status: 403 },
			);
		}

		const member = await User.findById(memberId);
		const isBlocked = await Blocked.findOne({ blocked: memberId });
		if (isBlocked) {
			return NextResponse.json(
				{ error: 'This member has already being blocked' },
				{ status: 403 },
			);
		}
		if (!member) {
			return NextResponse.json(
				{
					error: 'No account was found with this Id',
				},
				{ status: 405 },
			);
		}
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{
					error: 'No admin was found with this Id',
				},
				{ status: 405 },
			);
		}
		const isAdmin = admin.role === 'super_admin';

		if (!isAdmin) {
			return NextResponse.json(
				{
					error: 'Only Super admins are allowed to perform this action',
				},
				{ status: 405 },
			);
		}

		await Blocked.create({
			blocked: memberId,
			reason: reason ? reason : null,
			blocked_by: adminId,
		});
		await Alert.create({
			type: 'member_blocked',
			message: `blocked a member: ${member?.email}`,
			triggered_by: adminId,
			status: 'delete',
		});
		return NextResponse.json(
			{
				message: 'Member blocked successfully',
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

