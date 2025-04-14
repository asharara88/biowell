/*
  # Create wearable data tables and policies

  1. New Tables
    - `wearable_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `device_id` (text)
      - `device_type` (text)
      - `last_sync` (timestamptz)
      - `metrics` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `wearable_data` table
    - Add policies for authenticated users to:
      - Read their own data
      - Insert their own data
      - Update their own data
*/

CREATE TABLE IF NOT EXISTS wearable_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  device_id text NOT NULL,
  device_type text NOT NULL,
  last_sync timestamptz DEFAULT now(),
  metrics jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_id)
);

ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wearable data"
  ON wearable_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wearable data"
  ON wearable_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wearable data"
  ON wearable_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);