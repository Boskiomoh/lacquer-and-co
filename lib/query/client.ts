import { QueryClient } from "@tanstack/react-query";

export const GC_TIME = 10 * 60 * 1000;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Slots move, so availability goes stale quickly.
        staleTime: 30 * 1000,
        gcTime: GC_TIME,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}
