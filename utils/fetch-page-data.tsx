import { useEffect, useState, useCallback, useMemo } from 'react';

interface UsePageFetchProps {
	basePath: string;
	ids: (string | number)[];
	eventKey?: string;
	pollingInterval?: number;
	enabled?: boolean;
	dep?: unknown;
	dataKey?: string;
}

export function usePageFetch<T = unknown>({
	basePath,
	ids,
	eventKey = '',
	pollingInterval,
	enabled = true,
	dep,
	dataKey = 'response',
}: UsePageFetchProps) {
	const [fetchedData, setFetchedData] = useState<T | null>(null);
	const [isFetching, setIsFetching] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState('');

	// Prevent "new array every render" issue
	// eslint-disable-next-line
	const stableIds = useMemo(() => ids, [JSON.stringify(ids)]);

	const fetchData = useCallback(async () => {
		if (!enabled || !basePath) return;

		setIsFetching(true);
		try {
			const res = await fetch(
				stableIds.length > 0 ? `${basePath}/${stableIds.join('/')}` : basePath,
			);

			const data = await res.json();

			if (!res.ok) {
				setHasError(true);
				setError(data.error || 'An error occurred');
				return;
			}

			setFetchedData(data[dataKey] ?? data.response);
			setHasError(false);
			setError('');
		} catch (err) {
			console.error(err);
			setHasError(true);
			setError('Network error');
		} finally {
			setIsFetching(false);
		}
	}, [basePath, stableIds, enabled, dataKey]);

	useEffect(() => {
		if (!enabled) return;
		let intervalId: NodeJS.Timeout;

		fetchData();

		if (eventKey) {
			const handleUpdate = () => fetchData();
			window.addEventListener(eventKey, handleUpdate);
			return () => window.removeEventListener(eventKey, handleUpdate);
		}

		if (pollingInterval) {
			intervalId = setInterval(fetchData, pollingInterval);
			return () => clearInterval(intervalId);
		}
	}, [fetchData, eventKey, pollingInterval, dep, enabled]);

	return { fetchedData, isFetching, hasError, error, refetch: fetchData };
}

