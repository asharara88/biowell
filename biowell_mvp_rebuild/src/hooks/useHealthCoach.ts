import { useState, useCallback } from 'react';
import { useCoachStore } from '../store/coachStore';
import { useLanguageStore } from '../store/languageStore';
import { saveMessage, getConversationHistory } from '../api/conversations';
import { generateHealthRecommendation } from '../api/healthCoach';
import { useGamificationStore } from '../store/gamificationStore';

interface HealthMetrics {
  glucose?: number;
  heartRate?: number;
  steps?: number;
  sleep?: {
    duration: number;
    quality: number;
  };
  stress?: number;
  energy?: number;
}

export function useHealthCoach(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { preferences, addRecentTopic } = useCoachStore();
  const { language } = useLanguageStore();
  const { addPoints } = useGamificationStore();

  const getConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const messages = await getConversationHistory(userId);
      return messages;
    } catch (err) {
      setError('Failed to load conversation history');
      console.error('Error fetching conversation:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const sendMessage = useCallback(async (
    message: string, 
    options?: { 
      goal?: string; 
      metrics?: HealthMetrics;
      awardPoints?: boolean;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Save user message
      await saveMessage(
        userId, 
        message, 
        'user', 
        { 
          goal: options?.goal,
          language: preferences.language || language
        }
      );
      
      // Add to recent topics if it's a new question
      if (message.trim().endsWith('?')) {
        addRecentTopic(message);
      }
      
      // Generate coach response
      let response;
      if (options?.metrics) {
        // If metrics are provided, use the health recommendation endpoint
        response = await generateHealthRecommendation(
          userId,
          options.metrics,
          options?.goal || 'general'
        );
      } else {
        // Otherwise use the standard message endpoint
        response = await saveMessage(
          userId,
          'Processing...',
          'coach',
          {
            goal: options?.goal,
            language: preferences.language || language
          }
        );
      }
      
      // Award points if enabled
      if (options?.awardPoints !== false) {
        addPoints(5, 'habit', 'Consulted with Health Coach', { messageId: response.id });
      }
      
      return response;
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, preferences, language, addRecentTopic, addPoints]);

  const analyzeMetrics = useCallback(async (
    metrics: HealthMetrics,
    goal?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await generateHealthRecommendation(
        userId,
        metrics,
        goal || 'health'
      );
      
      return response;
    } catch (err) {
      setError('Failed to analyze metrics');
      console.error('Error analyzing metrics:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    isLoading,
    error,
    getConversation,
    sendMessage,
    analyzeMetrics,
    clearError: () => setError(null)
  };
}