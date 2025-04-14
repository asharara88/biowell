import { useQuery } from '@tanstack/react-query';
import { supabase } from '../api/client';
import type { Message } from '../api/conversations';

export function useChatHistory(userId: string) {
  return useQuery({
    queryKey: ['chatMessages', userId],
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch chat history: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
    refetchOnWindowFocus: true,
    retry: 2
  });
}