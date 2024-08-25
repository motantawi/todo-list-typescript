import { useState, useEffect, useCallback } from "react";

type AsyncFunction<T> = () => Promise<T>;

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useFetch<T>(
  asyncFunction: AsyncFunction<T> | null
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!asyncFunction) return;

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (!asyncFunction) return;

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
