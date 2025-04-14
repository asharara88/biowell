/*
  # Create CGM data tables and policies

  1. New Tables
    - `cgm_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `timestamp` (timestamptz)
      - `glucose_level` (numeric)
      - `trend` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `cgm_data` table
    - Add policies for authenticated users to:
      - Read their own data
      - Insert their own data
*/

CREATE TABLE IF NOT EXISTS cgm_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz DEFAULT now(),
  glucose_level numeric NOT NULL,
  trend text CHECK (trend IN ('rising', 'falling', 'stable')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cgm_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own CGM data"
  ON cgm_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CGM data"
  ON cgm_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);