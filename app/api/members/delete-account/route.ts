import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import User from '~/lib/models/user';

export async function DELETE(req: NextRequest) {
	try {
		await connectMongo();
		const { memberId, adminId } = await req.json();

		if (!isValidObjectId(memberId)) {
			return NextResponse.json(
				{ error: 'Invalid member Id or not provided' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Invalid admin Id or not provided' },
				{ status: 400 },
			);
		}

		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'Admin account not found' },
				{ status: 404 },
			);
		}

		if (admin.role !== 'super_admin' && admin.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 403 },
			);
		}

		const member = await User.findByIdAndDelete(memberId);
		await Alert.create({
			type: 'account_deleted',
			message: `deleted ${member?.first_name} ${
				member?.last_name || ''
			} account`,
			triggered_by: admin?._id,
			status: 'delete',
		});
		if (!member) {
			return NextResponse.json({ error: 'Member not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ message: 'Account deleted successfully', member },
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

