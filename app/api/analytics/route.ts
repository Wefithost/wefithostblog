// import { NextResponse } from 'next/server';
// import { BetaAnalyticsDataClient } from '@google-analytics/data';

// // Make sure you set GOOGLE_APPLICATION_CREDENTIALS env var
// const analyticsDataClient = new BetaAnalyticsDataClient();

// export async function GET() {
// 	try {
// 		const [response] = await analyticsDataClient.runReport({
// 			property: `properties/502419765`, // GA4 property ID
// 			dateRanges: [
// 				{
// 					startDate: 'firstDayOfLastMonth',
// 					endDate: 'lastDayOfLastMonth',
// 					name: 'last_month',
// 				},
// 				{ startDate: 'today', endDate: 'today', name: 'today' },
// 			],
// 			metrics: [{ name: 'activeUsers' }],
// 		});

// 		// Extract results
// 		const lastMonth = response.rows?.[0]?.metricValues?.[0]?.value ?? '0';
// 		const today = response.rows?.[0]?.metricValues?.[1]?.value ?? '0';
// 		console.log('todahy', today);
// 		console.log('lastMonth', lastMonth);
// 		return NextResponse.json({
// 			lastMonth,
// 			today,
// 		});
// 	} catch (error) {
// 		console.error('GA API Error:', error);
// 		return NextResponse.json(
// 			{ error: 'Failed to fetch analytics' },
// 			{ status: 500 },
// 		);
// 	}
// }

import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Make sure you set GOOGLE_APPLICATION_CREDENTIALS env var
const analyticsDataClient = new BetaAnalyticsDataClient({
	credentials: {
		client_email: process.env.GA_CLIENT_EMAIL,
		private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	},
});

function getLastMonthDateRange() {
	const now = new Date();

	// last month index
	const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

	// format YYYY-MM-DD
	const format = (d: Date) => d.toISOString().split('T')[0];

	return {
		startDate: format(firstDay),
		endDate: format(lastDay),
	};
}

export async function GET() {
	try {
		const lastMonthRange = getLastMonthDateRange();

		const [response] = await analyticsDataClient.runReport({
			property: `properties/502419765`, // GA4 property ID
			dateRanges: [
				{ ...lastMonthRange, name: 'last_month' },
				{ startDate: 'today', endDate: 'today', name: 'today' },
			],
			metrics: [{ name: 'activeUsers' }],
		});

		const lastMonth = response.rows?.[0]?.metricValues?.[0]?.value ?? '0';
		const today = response.rows?.[0]?.metricValues?.[1]?.value ?? '0';

		return NextResponse.json({
			lastMonth,
			today,
		});
	} catch (error) {
		console.error('GA API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch analytics' },
			{ status: 500 },
		);
	}
}

