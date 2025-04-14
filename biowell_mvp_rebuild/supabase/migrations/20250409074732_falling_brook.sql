/*
  # Create supplement recommendations tables and policies

  1. New Tables
    - `supplement_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `dosage` (text)
      - `timing` (text)
      - `stack_id` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `supplement_recommendations` table
    - Add policies for authenticated users to:
      - Read their own recommendations
      - System service role can insert/update recommendations
*/

CREATE TABLE IF NOT EXISTS supplement_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  dosage text NOT NULL,
  timing text NOT NULL,
  stack_id text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supplement_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own supplement recommendations"
  ON supplement_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage supplement recommendations"
  ON supplement_recommendations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);