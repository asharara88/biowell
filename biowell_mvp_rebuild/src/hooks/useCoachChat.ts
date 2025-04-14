import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveMessage, getConversationHistory } from '../api/conversations';
import { useErrorHandler } from './useErrorHandler';
import type { Message } from '../api/conversations';

interface ChatOptions {
  goal?: string;
  language?: 'en' | 'ar';
}

const CHAT_MESSAGES_KEY = 'chatMessages';

export function useCoachChat(userId: string) {
  const queryClient = useQueryClient();
  const { error, handleError, clearError } = useErrorHandler('CoachChat');

  const query = useQuery({
    queryKey: [CHAT_MESSAGES_KEY, userId],
    queryFn: () => getConversationHistory(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  const mutation = useMutation({
    mutationFn: async (input: { content: string; options?: ChatOptions }) => {
      // Save user message
      const userMessage = await saveMessage(userId, input.content, 'user', input.options);
      
      // Optimistically update cache
      queryClient.setQueryData<Message[]>([CHAT_MESSAGES_KEY, userId], (old = []) => [
        ...old,
        userMessage
      ]);

      // Get AI response
      const coachMessage = await saveMessage(userId, 'Processing...', 'coach', input.options);
      
      return { userMessage, coachMessage };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [CHAT_MESSAGES_KEY, userId] });
    },
    onError: (error) => {
      handleError(error);
    }
  });

  const clearConversation = async () => {
    queryClient.setQueryData([CHAT_MESSAGES_KEY, userId], []);
    // Additional cleanup if needed
  };

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    sendMessage: mutation.mutate,
    isSending: mutation.isPending,
    error: error.show ? error.message : null,
    clearError,
    clearConversation
  };
}