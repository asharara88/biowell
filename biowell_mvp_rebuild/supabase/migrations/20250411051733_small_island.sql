/*
  # Create Food Log Schema

  1. New Tables
    - `food_logs`
      - Track food intake with timestamps and details
      - Store nutritional information
      - Link to CGM readings for analysis
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_time timestamp with time zone DEFAULT now(),
  meal_type text CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name text NOT NULL,
  portion_size text,
  calories integer,
  carbohydrates numeric,
  protein numeric,
  fat numeric,
  notes text,
  pre_glucose numeric,
  post_glucose numeric,
  glucose_impact numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create own food logs"
  ON food_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own food logs"
  ON food_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs"
  ON food_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs"
  ON food_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_food_logs_user_meal_time 
  ON food_logs(user_id, meal_time DESC);

CREATE INDEX idx_food_logs_glucose_impact 
  ON food_logs(user_id, glucose_impact);