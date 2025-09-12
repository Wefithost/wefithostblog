import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import User from '~/lib/models/user';

const JWT_SECRET = process.env.JWT_SECRET as string;

const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account && user) {
				await connectMongo();
				//eslint-disable-next-line
				const ip = (user as any).ip || (global as any).req?.ip || null;

				let existingUser = await User.findOne({ email: user.email });
				if (!existingUser) {
					existingUser = await User.create({
						email: user.email,
						profile: user.image || '',
						oauth_provider: 'google',
						first_name: user.name || 'User',
						role: 'member',
						recent_articles: [],
						notifications: [],
						ip_address: ip,
					});

					await Alert.create({
						type: 'user_subscribed',
						message: `${user.name} created an account`,
						triggered_by: existingUser._id, // ✅ Use the MongoDB ObjectId
						status: 'create',
						link: {
							url: `${existingUser?.email}`,
							label: 'Email',
						},
					});
				}

				token.id = existingUser._id;
				token.email = existingUser.email;
				token.oauthProvider = existingUser.oauth_provider;
				token.name = `${existingUser.first_name}`;
			}

			return token;
		},
		//eslint-disable-next-line
		session({ session, token }: any) {
			if (token) {
				session.user.id = token.id;
				session.user.email = token.email;
				session.user.name = token.name;
			}

			return session;
		},
	},

	secret: JWT_SECRET,

	session: {
		strategy: 'jwt',
	},
};

export default authOptions;

