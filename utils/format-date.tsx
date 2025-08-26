const today = new Date();
const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

export const formattedDate = today
	.toLocaleDateString('en-US', options)
	.toUpperCase();

export function formatDate(
	isoString: string,
	withTime: boolean = false,
): string {
	try {
		if (!isoString) throw new Error('Invalid ISO string');

		const date = new Date(isoString);
		if (isNaN(date.getTime())) throw new Error('Invalid date');

		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		};

		if (withTime) {
			options.hour = 'numeric';
			options.minute = '2-digit';
			options.hour12 = true; // makes it AM/PM
		}

		return new Intl.DateTimeFormat('en-US', options).format(date);
	} catch (error) {
		return 'Invalid Date ' + error;
	}
}

