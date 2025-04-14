import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/client';
import { handleError } from '../utils/error-handling';
import type { HealthMetrics } from '../types/health';

const HEALTH_METRICS_KEY = 'healthMetrics';

async function fetchHealthMetrics(userId: string): Promise<HealthMetrics[]> {
  const { data, error } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function addHealthMetric(metric: Partial<HealthMetrics>): Promise<HealthMetrics> {
  const { data, error } = await supabase
    .from('health_metrics')
    .insert([metric])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateHealthMetric(id: string, updates: Partial<HealthMetrics>): Promise<HealthMetrics> {
  const { data, error } = await supabase
    .from('health_metrics')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useHealthMetrics(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [HEALTH_METRICS_KEY, userId],
    queryFn: () => fetchHealthMetrics(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => handleError(error, 'fetchHealthMetrics')
  });

  const addMutation = useMutation({
    mutationFn: addHealthMetric,
    onMutate: async (newMetric) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [HEALTH_METRICS_KEY, userId] });

      // Snapshot previous value
      const previousMetrics = queryClient.getQueryData<HealthMetrics[]>([HEALTH_METRICS_KEY, userId]);

      // Optimistically update
      queryClient.setQueryData<HealthMetrics[]>([HEALTH_METRICS_KEY, userId], old => {
        const optimisticMetric = {
          id: 'temp-id',
          created_at: new Date().toISOString(),
          ...newMetric
        } as HealthMetrics;
        return old ? [optimisticMetric, ...old] : [optimisticMetric];
      });

      return { previousMetrics };
    },
    onError: (err, newMetric, context) => {
      // Rollback on error
      if (context?.previousMetrics) {
        queryClient.setQueryData([HEALTH_METRICS_KEY, userId], context.previousMetrics);
      }
      handleError(err, 'addHealthMetric');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [HEALTH_METRICS_KEY, userId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<HealthMetrics> }) => 
      updateHealthMetric(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: [HEALTH_METRICS_KEY, userId] });

      const previousMetrics = queryClient.getQueryData<HealthMetrics[]>([HEALTH_METRICS_KEY, userId]);

      queryClient.setQueryData<HealthMetrics[]>([HEALTH_METRICS_KEY, userId], old => {
        if (!old) return old;
        return old.map(metric => 
          metric.id === id ? { ...metric, ...updates } : metric
        );
      });

      return { previousMetrics };
    },
    onError: (err, variables, context) => {
      if (context?.previousMetrics) {
        queryClient.setQueryData([HEALTH_METRICS_KEY, userId], context.previousMetrics);
      }
      handleError(err, 'updateHealthMetric');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [HEALTH_METRICS_KEY, userId] });
    }
  });

  return {
    metrics: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    addMetric: addMutation.mutate,
    updateMetric: updateMutation.mutate,
    isAddingMetric: addMutation.isPending,
    isUpdatingMetric: updateMutation.isPending
  };
}