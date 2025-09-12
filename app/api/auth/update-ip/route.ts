// app/api/auth/record-ip/route.ts
import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server'; // use your actual path
import connectMongo from '~/lib/connect-mongo'; // your connect util
import User from '~/lib/models/user';

export async function POST(req: NextRequest) {
	try {
		await connectMongo();

		const { userId, userIp } = await req.json();
		if (!isValidObjectId(userId)) {
			return;
		}

		if (!userIp || userIp.trim() === '') {
			return;
		}
		// Extract client IP from headers (works with Vercel / proxies)
		const forwarded = req.headers.get('x-forwarded-for');
		const ip =
			forwarded?.split(',')[0]?.trim() ||
			req.headers.get('x-real-ip') ||
			'unknown';

		// update the user's ip_address field
		await User.findByIdAndUpdate(userId, { ip_address: ip });

		return NextResponse.json({ ok: true, ip });
	} catch (err) {
		console.error('record-ip error:', err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

