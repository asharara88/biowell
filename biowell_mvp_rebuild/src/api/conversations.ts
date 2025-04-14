import { supabase } from './client';
import { handleError } from '../utils/error-handling';

export interface Message {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'coach';
  metadata?: {
    type?: 'text' | 'metrics';
    goal?: string | null;
    language?: 'en' | 'ar';
  };
  created_at?: string;
}

export async function saveMessage(
  userId: string,
  content: string,
  role: 'user' | 'coach',
  options: {
    goal?: string;
    language?: 'en' | 'ar';
  } = {}
): Promise<Message> {
  try {
    if (role === 'coach' && content === 'Processing...') {
      // For coach messages that are placeholders, generate a response from the health-coach function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-coach`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message: options.goal ? `Provide advice about ${options.goal}` : 'Provide general health advice',
          goal: options.goal,
          language: options.language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get coach response');
      }

      return await response.json();
    }

    const { data, error } = await supabase
      .from('coach_messages')
      .insert({
        user_id: userId,
        content,
        role,
        metadata: {
          type: 'text',
          goal: options.goal || null,
          language: options.language || 'en'
        }
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    handleError(error, 'saveMessage');
    throw new Error('Failed to save message');
  }
}

export async function getConversationHistory(userId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    handleError(error, 'getConversationHistory');
    throw new Error('Failed to fetch conversation history');
  }
}

export function subscribeToMessages(
  userId: string,
  callback: (message: Message) => void
): () => void {
  const subscription = supabase
    .channel('coach_messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'coach_messages',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}