import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import User from '~/lib/models/user';

export async function PATCH(req: NextRequest) {
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

		const member = await User.findById(memberId);
		if (!member) {
			return NextResponse.json({ error: 'Member not found' }, { status: 404 });
		}

		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'Admin account not found' },
				{ status: 404 },
			);
		}

		if (admin.role !== 'super_admin') {
			return NextResponse.json(
				{ error: 'Only super admins are allowed to perform this action' },
				{ status: 403 },
			);
		}

		const newRole = member.role === 'member' ? 'admin' : 'member';
		member.role = newRole;

		await member.save();

		await Alert.create({
			type: 'role_changed',
			message: `made ${member?.first_name} ${newRole}`,
			triggered_by: admin._id,
			status: 'info',
		});
		return NextResponse.json(
			{ message: 'Role updated successfully', member },
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

