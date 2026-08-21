/**
 * useDummyFallback — Central conditional dummy data helper
 *
 * STRATEGY:
 * - RTK Query is ALWAYS called (real API call goes out).
 * - If the backend is unavailable (network error, 404, etc.) OR
 *   NEXT_PUBLIC_BASE_URL is not configured, dummy data is returned instead.
 * - Once the backend is live and NEXT_PUBLIC_BASE_URL is set,
 *   real API data replaces the dummy data automatically — no code changes needed.
 *
 * USAGE:
 *   const stats = useDummyFallback(useGetAdminDashboardStatsQuery, DUMMY_ADMIN_STATS);
 *   // stats.data is real API data OR dummy data
 *   // stats.isLoading shows real loading state
 */

type RTKQueryResult<T> = {
  data?: T;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error?: unknown;
};

const isBackendConfigured = Boolean(process.env.NEXT_PUBLIC_BASE_URL);

export function useDummyFallback<T>(
  queryResult: RTKQueryResult<T>,
  dummyData: T
): RTKQueryResult<T> & { data: T } {
  // Use real data if available; fall back to dummy when error or no backend
  const shouldUseDummy = !isBackendConfigured || queryResult.isError;
  const resolvedData: T = queryResult.data ?? (shouldUseDummy ? dummyData : dummyData);

  return {
    ...queryResult,
    data: resolvedData,
    isLoading: isBackendConfigured ? queryResult.isLoading : false,
    isError: isBackendConfigured ? queryResult.isError : false,
  };
}

/**
 * Helper for mutations — wraps onSubmit so it calls the real mutate fn,
 * but if backend is unconfigured, simulates success with a delay.
 */
export function createDummyMutationHandler<TArg, TResult>(
  mutate: (arg: TArg) => Promise<{ data?: TResult; error?: unknown }>,
  dummyResult: TResult,
  delayMs = 800
) {
  return async (arg: TArg): Promise<{ data: TResult }> => {
    if (!isBackendConfigured) {
      await new Promise((r) => setTimeout(r, delayMs));
      return { data: dummyResult };
    }
    const result = await mutate(arg);
    if (result.error) throw result.error;
    return { data: result.data as TResult };
  };
}
