import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import User from '~/lib/models/user';

export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);

		const adminId = searchParams.get('adminId');
		const skip = parseInt(searchParams.get('skip') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '10', 10);
		const statusParam = searchParams.get('status') || 'all';
		const roleParam = searchParams.get('role') || 'all';
		const actionParam = searchParams.get('action') || 'all';

		// eslint-disable-next-line
		let filter: any = {};

		// STATUS FILTER
		if (statusParam && statusParam !== 'all') {
			const statuses = statusParam.split(',');
			filter.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
		}

		// ACTION FILTER (alert.type)
		if (actionParam && actionParam !== 'all') {
			const actions = actionParam.split(',');
			filter.type = actions.length > 1 ? { $in: actions } : actions[0];
		}

		// Ensure adminId is valid
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

		// --- CLEANUP STEP: ensure only latest 100 alerts remain ---
		const totalAlerts = await Alert.countDocuments({});
		if (totalAlerts > 100) {
			const toDelete = totalAlerts - 100;

			await Alert.find({})
				.sort({ createdAt: 1 }) // oldest first
				.limit(toDelete)
				.then((oldest) => {
					const ids = oldest.map((a) => a._id);
					if (ids.length > 0) {
						return Alert.deleteMany({ _id: { $in: ids } });
					}
				});
		}

		// BUILD QUERY
		//eslint-disable-next-line
		let query = Alert.find(filter)
			.skip(skip)
			.limit(limit)
			.populate({
				path: 'triggered_by',
				select: 'first_name last_name role',
			})
			.sort({ createdAt: -1 })
			.lean();

		// ROLE FILTER (we need to filter after populate)
		let alerts = await query;

		if (roleParam && roleParam !== 'all') {
			const roles = roleParam.split(',');
			alerts = alerts.filter(
				(alert) =>
					//@ts-expect-error: role is a string
					alert.triggered_by && roles.includes(alert.triggered_by.role),
			);
		}

		// Count total alerts (with filters, but note role filtering is applied in-memory)
		const alertsLength =
			roleParam !== 'all' ? alerts.length : await Alert.countDocuments(filter);

		return NextResponse.json({ response: alerts, alertsLength });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

