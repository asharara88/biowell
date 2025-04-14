import { supabase } from './client';

export interface CoachMessage {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'coach';
  created_at: string;
  metadata?: {
    type?: 'text' | 'stack-recommendation' | 'goal-setting';
    goal?: string | null;
    language?: string;
  };
}

export async function saveMessage(message: Omit<CoachMessage, 'id' | 'created_at'>) {
  if (!message.user_id || !message.content || !message.role) {
    throw new Error('Missing required message fields');
  }

  try {
    const { data, error } = await supabase
      .from('coach_messages')
      .insert([{
        user_id: message.user_id,
        content: message.content,
        role: message.role,
        metadata: message.metadata || {}
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function getConversationHistory(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
}

export async function generateCoachResponse(
  userId: string,
  message: string,
  selectedGoal?: string
): Promise<CoachMessage> {
  if (!userId || !message) {
    throw new Error('User ID and message are required');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        message,
        goal: selectedGoal
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get coach response');
    }

    const data = await response.json();
    
    if (!data || typeof data.content !== 'string') {
      throw new Error('Invalid response format from coach');
    }

    return data;
  } catch (error) {
    console.error('Error generating coach response:', error);
    throw error;
  }
}