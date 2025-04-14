import { QueryClient } from '@tanstack/react-query';
import { logException } from '../utils/analytics';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: true,
      retry: 2,
      refetchOnMount: true,
      onError: (error) => {
        logException(`Query Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        logException(`Mutation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
});

// Prefetch utilities
export const prefetchQuery = async (queryKey: string[], queryFn: () => Promise<unknown>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

// Optimistic update helper
export const optimisticUpdate = <T>(
  queryKey: string[],
  updateFn: (oldData: T) => T
) => {
  queryClient.setQueryData(queryKey, (oldData: T) => updateFn(oldData));
};

// Invalidation helper
export const invalidateQueries = async (queryKey: string[]) => {
  await queryClient.invalidateQueries({ queryKey });
};