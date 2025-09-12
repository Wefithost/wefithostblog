import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import Blocked from '~/lib/models/blocked';
import User from '~/lib/models/user';

export async function DELETE(req: NextRequest) {
	try {
		await connectMongo();
		const { blockedId, adminId } = await req.json();

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 403 },
			);
		}

		if (!isValidObjectId(blockedId)) {
			return NextResponse.json(
				{ error: 'Blocked Id not provided or invalid' },
				{ status: 403 },
			);
		}

		const user = await User.findById(adminId);

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

		const unblockedData = await Blocked.findByIdAndDelete(blockedId);
		await Alert.create({
			type: unblockedData?.ip_address ? 'ip_unblocked' : 'member_unblocked',
			message: `unblocked a ${
				unblockedData?.ip_address ? 'ip address' : 'member'
			}`,
			triggered_by: adminId,
			status: 'create',
		});
		return NextResponse.json(
			{
				message: 'Unblock done successfully',
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

