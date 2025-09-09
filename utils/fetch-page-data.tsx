import { useEffect, useState, useCallback, useMemo } from 'react';

interface useFetchProps {
	basePath: string;
	ids: (string | number)[];
	eventKey?: string;
	pollingInterval?: number;
	enabled?: boolean;
	dep?: unknown;
	dataKey?: string;
}

export function useFetch<T = unknown>({
	basePath,
	ids,
	eventKey = '',
	pollingInterval,
	enabled = true,
	dep,
	dataKey = 'response',
}: useFetchProps) {
	const [fetchedData, setFetchedData] = useState<T | null>(null);
	const [isFetching, setIsFetching] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState('');

	// Prevent "new array every render" issue
	// eslint-disable-next-line
	const stableIds = useMemo(() => ids, [JSON.stringify(ids)]);

	const fetchData = useCallback(
		async (silent = false) => {
			if (!enabled || !basePath) return;

			if (!silent) setIsFetching(true);

			try {
				const res = await fetch(
					stableIds.length > 0
						? `${basePath}/${stableIds.join('/')}`
						: basePath,
				);

				const data = await res.json();

				if (!res.ok) {
					if (!silent) {
						setHasError(true);
						setError(data.error || 'An error occurred');
					}
					return;
				}

				setFetchedData(data[dataKey] ?? data.response);
				if (!silent) {
					setHasError(false);
					setError('');
				}
			} catch (err) {
				console.error(err);
				if (!silent) {
					setHasError(true);
					setError('Network error');
				}
			} finally {
				if (!silent) setIsFetching(false);
			}
		},
		[basePath, stableIds, enabled, dataKey],
	);

	useEffect(() => {
		if (!enabled) return;
		let intervalId: NodeJS.Timeout;

		// full fetch on mount or dep change
		fetchData(false);

		if (eventKey) {
			// silent fetch on window event
			const handleUpdate = () => fetchData(true);
			window.addEventListener(eventKey, handleUpdate);
			return () => window.removeEventListener(eventKey, handleUpdate);
		}

		if (pollingInterval) {
			intervalId = setInterval(() => fetchData(true), pollingInterval);
			return () => clearInterval(intervalId);
		}
	}, [fetchData, eventKey, pollingInterval, dep, enabled]);

	return {
		fetchedData,
		isFetching,
		hasError,
		error,
		refetch: () => fetchData(false),
	};
}

