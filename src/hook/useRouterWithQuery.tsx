'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useRouterWithQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushWithQuery = (
    path: string,
    options?: { preserveQuery?: boolean },
  ) => {
    const { preserveQuery = true } = options || {};

    if (!preserveQuery) {
      router.push(path); // no query params
      return;
    }
    // Get current query parameters
    const queryString = searchParams?.toString();
    // Append the query string if available
    const separator = path.includes('?') ? '&' : '?';
    const fullPath = queryString ? `${path}${separator}${queryString}` : path;
    router.push(fullPath);
  };

  return {
    ...router,
    push: pushWithQuery,
  };
}
