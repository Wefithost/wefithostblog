import { useEffect, useState } from "react";

interface usePageFetchProps {
  basePath: string;
  ids: (string | number)[];
  eventKey?: string;
  pollingInterval?: number;
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dep?: any;
}
// eslint-disable-next-line
export function usePageFetch<T = any>({
  basePath,
  ids,
  eventKey = "",
  pollingInterval,
  enabled = true,
  dep,
}: usePageFetchProps) {
  const [fetchedData, setFetchedData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!basePath) return;
    if (!enabled) return;
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const res = await fetch(`${basePath}/${ids.join("/")}`);
        const data = await res.json();

        if (!res.ok) {
          setHasError(true);
          setError(data.error);
          return;
        }

        setFetchedData(data.result);
        setHasError(false);
        setError("");
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener(eventKey, handleUpdate);

    // Polling setup (only if pollingInterval is provided)
    if (pollingInterval) {
      intervalId = setInterval(fetchData, pollingInterval);
    }

    return () => {
      window.removeEventListener(eventKey, handleUpdate);
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [basePath, eventKey, pollingInterval, ...ids, dep]);

  return { fetchedData, isFetching, hasError, error };
}
