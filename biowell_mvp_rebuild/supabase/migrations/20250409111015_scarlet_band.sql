/*
  # Schema Enhancements and Optimizations

  1. New Tables
    - `user_preferences` for storing user-specific application preferences
    - `health_metrics` for consolidated health data tracking
    
  2. Modifications
    - Add indexes for performance optimization
    - Add foreign key constraints for data integrity
    - Enhance RLS policies
    
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies for data access
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create health_metrics table for consolidated health data
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  metric_type text NOT NULL CHECK (metric_type IN ('heart_rate', 'steps', 'glucose', 'sleep', 'energy', 'stress')),
  value numeric NOT NULL,
  unit text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  source text NOT NULL CHECK (source IN ('wearable', 'cgm', 'manual', 'calculated')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_metrics
CREATE POLICY "Users can read own health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_timestamp 
  ON health_metrics(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_health_metrics_type_timestamp 
  ON health_metrics(metric_type, timestamp DESC);

-- Add trigger for updated_at on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add composite index for wearable_data
CREATE INDEX IF NOT EXISTS idx_wearable_data_user_device 
  ON wearable_data(user_id, device_id);

-- Add index for CGM data timestamp queries
CREATE INDEX IF NOT EXISTS idx_cgm_data_user_timestamp 
  ON cgm_data(user_id, timestamp DESC);

-- Add validation for coach_messages metadata
ALTER TABLE coach_messages 
  ADD CONSTRAINT coach_messages_metadata_check 
  CHECK (jsonb_typeof(metadata) = 'object');

-- Add index for coach_messages search
CREATE INDEX IF NOT EXISTS idx_coach_messages_content_gin 
  ON coach_messages USING gin(to_tsvector('english', content));