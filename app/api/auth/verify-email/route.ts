import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import verification from '~/lib/models/verification';
import Alert from '~/lib/models/alerts';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
	try {
		await connectMongo();

		const { email, verificationCode } = await req.json();

		const verificationRecord = await verification.findOne({ email });
		if (!verificationRecord) {
			return NextResponse.json(
				{ error: 'Verification record not found' },
				{ status: 404 },
			);
		}

		const isMatch = await bcrypt.compare(
			verificationCode,
			verificationRecord.hashed_code,
		);
		if (!isMatch) {
			return NextResponse.json(
				{ error: 'Invalid verification code' },
				{ status: 400 },
			);
		}

		const newUser = await User.create({
			email,
			password: verificationRecord.password,
			first_name: verificationRecord.first_name,
			last_name: verificationRecord.last_name,
			oauth_provider: 'local',
			verifiedAt: new Date(),
		});
		await Alert.create({
			type: 'user_subscribed',
			message: `${newUser?.first_name} created an account`,
			triggered_by: newUser?._id,
			status: 'create', // this is where you can use your status to color alerts
			link: {
				url: `${newUser?.email}`,
				label: 'Email',
			},
		});
		await verification.deleteOne({ email });
		const token = jwt.sign(
			{ userId: newUser._id, email: newUser.email },
			JWT_SECRET,
			{
				expiresIn: '7d',
			},
		);

		const response = NextResponse.json({
			message: 'Email verified and account created',
		});
		response.cookies.set({
			name: 'token',
			value: token,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60,
		});

		return response;
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'An error occurred during email verification' },
			{ status: 500 },
		);
	}
}

