import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';
import User from '~/lib/models/user';

export async function POST(req: NextRequest) {
	try {
		await connectMongo();
		const { email } = await req.json();

		if (!email || email.trim() === '') {
			return NextResponse.json(
				{
					error: 'An email is required',
				},
				{ status: 400 },
			);
		}

		const isSubscribed = await NewsletterSubscription.findOne({ email: email });
		if (isSubscribed) {
			return NextResponse.json(
				{ error: 'The email has already been subscribed to our newsletter' },
				{ status: 409 },
			);
		}
		const member = await User.findOne({ email: email });
		if (member) {
			await Alert.create({
				type: 'subscribed_to_newsletter',
				message: `${member?.first_name} subscribed to the newsletter`,
				triggered_by: member._id,
				status: 'create',
			});
		} else {
			await Alert.create({
				type: 'subscribed_to_newsletter',
				message: `${email} subscribed to the newsletter`,
				triggered_by: null,
				status: 'create',
			});
		}
		await NewsletterSubscription.create({ email: email });

		return NextResponse.json(
			{ message: 'Thanks for subscribing to our newsletter' },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			error: 'A server error occurred',
			status: 500,
		});
	}
}

