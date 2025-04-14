import { supabase } from './client';
import type { CoachMessage } from './coach';

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

export async function getHealthPrompt(domain: string, type: string) {
  const { data, error } = await supabase
    .from('health_coach_prompts')
    .select('*')
    .eq('domain', domain)
    .eq('prompt_type', type)
    .single();

  if (error) throw error;
  return data;
}

export async function analyzeHealthMetrics(metrics: HealthMetrics): Promise<string> {
  let analysis = '';

  if (metrics.glucose && metrics.glucose > 140) {
    analysis += 'Your glucose levels are elevated. Consider implementing glucose management strategies. ';
  }

  if (metrics.heartRate && metrics.heartRate > 100) {
    analysis += 'Your resting heart rate is elevated. Let\'s focus on heart-healthy practices. ';
  }

  if (metrics.sleep && metrics.sleep.duration < 7) {
    analysis += 'Your sleep duration is below optimal levels. Prioritizing sleep quality could benefit your overall health. ';
  }

  if (metrics.stress && metrics.stress > 7) {
    analysis += 'Your stress levels are elevated. Consider stress management techniques. ';
  }

  return analysis || 'Your metrics are within normal ranges. Let\'s focus on maintaining these healthy levels.';
}

export async function generateHealthRecommendation(
  userId: string,
  metrics: HealthMetrics,
  domain: string
): Promise<CoachMessage> {
  const analysis = await analyzeHealthMetrics(metrics);
  
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-coach`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      message: `Based on these health metrics: ${JSON.stringify(metrics)}, provide personalized recommendations for ${domain}. Analysis: ${analysis}`,
      domain
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate health recommendation');
  }

  return response.json();
}