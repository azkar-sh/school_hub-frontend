import * as React from "react";

interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
}

/**
 * Data-fetching hook that keeps all setState calls inside async callbacks,
 * satisfying the `react-hooks/set-state-in-effect` lint rule.
 *
 * - `isLoading` starts `true` when enabled, `false` otherwise
 * - On refetch (deps change), previous data stays visible until the new
 *   fetch resolves (stale-while-revalidate behaviour)
 * - `refetch()` can be called from event handlers to manually reload
 */
export function useFetchData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
  enabled: boolean = true,
): FetchResult<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(enabled);
  const [error, setError] = React.useState(false);

  const fetcherRef = React.useRef(fetcher);
  React.useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const refetch = React.useCallback(() => {
    fetcherRef
      .current()
      .then((result) => {
        setData(result);
        setIsLoading(false);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setIsLoading(false);
        setError(true);
      });
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refetch, ...deps]);

  return { data, isLoading, error, refetch };
}
