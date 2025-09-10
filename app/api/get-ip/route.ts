// /api/get-ip
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const forwardedFor = req.headers.get('x-forwarded-for');
	//@ts-expect-error: not defined by default
	const ip = forwardedFor?.split(',')[0]?.trim() || req.ip || 'unknown';

	return NextResponse.json({ ip });
}

