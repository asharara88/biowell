/*
  # Create wearable and CGM data tables

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
    
    - `cgm_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `timestamp` (timestamptz)
      - `glucose_level` (numeric)
      - `trend` (text, enum: rising, falling, stable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for authenticated users to insert their own data
    - Add policies for authenticated users to update their own data
*/

-- Create wearable_data table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'wearable_data') THEN
    CREATE TABLE wearable_data (
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

    -- Create policies only if they don't exist
    DO $policies$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'wearable_data' AND policyname = 'Users can read own wearable data') THEN
        CREATE POLICY "Users can read own wearable data"
          ON wearable_data
          FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
      END IF;

      IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'wearable_data' AND policyname = 'Users can insert own wearable data') THEN
        CREATE POLICY "Users can insert own wearable data"
          ON wearable_data
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
      END IF;

      IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'wearable_data' AND policyname = 'Users can update own wearable data') THEN
        CREATE POLICY "Users can update own wearable data"
          ON wearable_data
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
      END IF;
    END
    $policies$;
  END IF;
END
$$;

-- Create cgm_data table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cgm_data') THEN
    CREATE TABLE cgm_data (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      timestamp timestamptz DEFAULT now(),
      glucose_level numeric NOT NULL,
      trend text CHECK (trend IN ('rising', 'falling', 'stable')),
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE cgm_data ENABLE ROW LEVEL SECURITY;

    -- Create policies only if they don't exist
    DO $policies$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cgm_data' AND policyname = 'Users can read own CGM data') THEN
        CREATE POLICY "Users can read own CGM data"
          ON cgm_data
          FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
      END IF;

      IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cgm_data' AND policyname = 'Users can insert own CGM data') THEN
        CREATE POLICY "Users can insert own CGM data"
          ON cgm_data
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
      END IF;
    END
    $policies$;
  END IF;
END
$$;