/*
  # Health Coach Schema Setup

  1. New Tables
    - `health_coach_prompts`
      - Pre-defined prompts for different health domains
      - Ensures consistent coaching across areas
    
  2. Security
    - Enable RLS
    - Add policies for service role access
*/

-- Create health_coach_prompts table
CREATE TABLE IF NOT EXISTS health_coach_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL CHECK (domain IN (
    'health',
    'nutrition',
    'sleep',
    'fitness',
    'wellness',
    'supplements',
    'biometrics'
  )),
  prompt_type text NOT NULL CHECK (prompt_type IN (
    'initial_assessment',
    'follow_up',
    'recommendation',
    'analysis'
  )),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE health_coach_prompts ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role has full access to prompts"
  ON health_coach_prompts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated users to read prompts
CREATE POLICY "Authenticated users can read prompts"
  ON health_coach_prompts
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial prompts
INSERT INTO health_coach_prompts (domain, prompt_type, content, metadata) VALUES
  (
    'health',
    'initial_assessment',
    'I am your Personal Digital Health Coach. To provide personalized recommendations, please share your main health goals and any specific concerns you''d like to address.',
    '{"requires_metrics": false, "follow_up_required": true}'
  ),
  (
    'nutrition',
    'initial_assessment',
    'Let''s assess your nutritional needs. What are your current eating habits, dietary restrictions, and nutrition-related goals?',
    '{"requires_metrics": false, "follow_up_required": true}'
  ),
  (
    'sleep',
    'analysis',
    'Based on your sleep data, I notice [metrics]. Here are personalized recommendations to improve your sleep quality.',
    '{"requires_metrics": true, "metric_types": ["sleep_duration", "sleep_quality", "bedtime", "wake_time"]}'
  ),
  (
    'fitness',
    'recommendation',
    'Considering your fitness goals and current activity levels, here''s a personalized exercise recommendation.',
    '{"requires_metrics": true, "metric_types": ["activity_level", "heart_rate", "recovery"]}'
  ),
  (
    'supplements',
    'recommendation',
    'Based on your health data and goals, here are personalized supplement recommendations. Always consult with a healthcare provider before starting any new supplement regimen.',
    '{"requires_metrics": true, "metric_types": ["nutrient_levels", "health_goals"]}'
  ),
  (
    'biometrics',
    'analysis',
    'Let''s analyze your recent health metrics. Here''s what your data is telling us and what adjustments might be beneficial.',
    '{"requires_metrics": true, "metric_types": ["glucose", "heart_rate", "hrv", "sleep"]}'
  )
ON CONFLICT DO NOTHING;