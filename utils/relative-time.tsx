import { formatDistanceToNowStrict } from 'date-fns';

export function formatRelativeTime(isoString: string): string {
	try {
		if (!isoString) throw new Error('No date string provided');

		const date = new Date(isoString);
		if (isNaN(date.getTime())) throw new Error('Invalid date');

		const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

		// If less than 60 seconds ago, show "now"
		if (diffInSeconds < 60) {
			return 'now';
		}

		// Otherwise, show formatted relative time
		return formatDistanceToNowStrict(date, { addSuffix: true });
	} catch (error) {
		console.log(error);
		return 'Invalid Date';
	}
}

