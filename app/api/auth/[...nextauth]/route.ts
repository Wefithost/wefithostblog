import NextAuth from 'next-auth';
import authOptions from '~/lib/configs/auth/authOptions';

const handler = (req: any, res: any) => {
	// ✅ extract IP from headers or socket
	const ip =
		req.headers.get('x-forwarded-for')?.split(',')[0] ||
		req.ip || // in some environments
		req.socket?.remoteAddress ||
		null;

	// attach IP to request so callbacks can access it
	(req as any).ip = ip;

	return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };

