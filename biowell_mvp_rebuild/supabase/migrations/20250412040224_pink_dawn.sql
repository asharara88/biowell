/*
  # Create wellness scores table

  1. New Tables
    - `wellness_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `score` (integer, 0-100)
      - `breakdown` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own scores
      - Insert their own scores
      - Update their own scores
      - Delete their own scores
*/

-- Create wellness_scores table
CREATE TABLE IF NOT EXISTS wellness_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  breakdown jsonb DEFAULT '{}'::jsonb CHECK (jsonb_typeof(breakdown) = 'object'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wellness_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read own wellness scores"
  ON wellness_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness scores"
  ON wellness_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness scores"
  ON wellness_scores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness scores"
  ON wellness_scores
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wellness_scores_user_date 
  ON wellness_scores(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_wellness_scores_score 
  ON wellness_scores(score);

-- Add table comment
COMMENT ON TABLE wellness_scores IS 'Stores daily wellness scores and breakdowns for users';

-- Add column comments
COMMENT ON COLUMN wellness_scores.score IS 'Overall wellness score (0-100)';
COMMENT ON COLUMN wellness_scores.breakdown IS 'Detailed breakdown of score components';