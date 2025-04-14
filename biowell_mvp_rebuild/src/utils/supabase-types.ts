// Generated types from Supabase schema
export type WearableData = {
  id: string;
  user_id: string;
  device_id: string;
  device_type: 'fitbit' | 'garmin' | 'apple_health' | 'freestyle_libre';
  last_sync: string;
  metrics: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type CGMData = {
  id: string;
  user_id: string;
  timestamp: string;
  glucose: number;
  trend?: 'rising' | 'falling' | 'stable';
  created_at: string;
}

export type SupplementRecommendation = {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  timing: string;
  stack_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type UserSettings = {
  id: string;
  user_id: string;
  tone: 'friendly' | 'professional' | 'motivational';
  detail_level: 'standard' | 'detailed';
  created_at: string;
  updated_at: string;
}