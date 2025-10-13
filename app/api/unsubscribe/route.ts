import { NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';

export async function POST(req: Request) {
	try {
		await connectMongo();
		const email = await req.json();

		if (!email) {
			return NextResponse.json(
				{ error: 'Email not provided' },
				{ status: 400 },
			);
		}

		const subscriber = await NewsletterSubscription.findOne({ email });
		if (!subscriber) {
			return NextResponse.json(
				{ message: 'You’re already unsubscribed.' },
				{ status: 200 },
			);
		}

		await NewsletterSubscription.deleteOne({ email });

		return NextResponse.redirect('https://blog.wefithost.com/unsubscribed');
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 },
		);
	}
}

