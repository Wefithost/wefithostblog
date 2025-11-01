import { NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';
import User from '~/lib/models/user';

export async function POST(req: Request) {
	try {
		await connectMongo();
		const { adminId, email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ error: 'Email not provided' },
				{ status: 400 },
			);
		}

		if (!adminId) {
			return NextResponse.json(
				{ error: 'Admin Id not provided' },
				{ status: 400 },
			);
		}

		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'Only super admins can perform this action' },
				{ status: 400 },
			);
		}

		const subscriber = await NewsletterSubscription.findOne({ email });
		if (!subscriber) {
			return NextResponse.json(
				{ message: 'Account already unsubscribed.' },
				{ status: 200 },
			);
		}
		const member = await User.findOne({ email: email });
		if (member) {
			await Alert.create({
				type: 'unsubscribed_by_admin',
				message: `${admin?.first_name} unsubscribed ${member?.first_name} from the newsletter`,
				triggered_by: admin?._id,
				status: 'delete',
			});
		} else {
			await Alert.create({
				type: 'unsubscribed_by_admin',
				message: `${admin?.first_name} unsubscribed ${email} from the newsletter`,
				triggered_by: admin?._id,
				status: 'delete',
			});
		}
		await NewsletterSubscription.deleteOne({ email });

		return NextResponse.json(
			{ message: 'You have successfully been unsubscribed' },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 },
		);
	}
}

