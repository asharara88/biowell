/*
  # Create configuration table with RLS

  1. New Tables
    - `configuration`
      - `id` (uuid, primary key)
      - `key` (text)
      - `value` (jsonb)
      - `scope` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `configuration` table
    - Add policies for authenticated users to read public configurations
    - Add policies for service role to manage all configurations
*/

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing table if it exists
DROP TABLE IF EXISTS configuration;

-- Create the configuration table
CREATE TABLE configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  scope text NOT NULL DEFAULT 'public',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint
ALTER TABLE configuration 
  ADD CONSTRAINT configuration_key_scope_unique 
  UNIQUE (key, scope);

-- Enable RLS
ALTER TABLE configuration ENABLE ROW LEVEL SECURITY;

-- Create trigger for updating updated_at
CREATE TRIGGER update_configuration_updated_at
  BEFORE UPDATE ON configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create new policies
CREATE POLICY "Users can read public configurations"
  ON configuration
  FOR SELECT
  TO authenticated
  USING (scope = 'public');

CREATE POLICY "Service role has full access to configurations"
  ON configuration
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_configuration_key_scope 
  ON configuration(key, scope);

-- Insert initial configurations
INSERT INTO configuration (key, value, scope)
VALUES 
  ('app_version', '"1.0.0"'::jsonb, 'public'),
  ('features', '{"chat": true, "recommendations": true}'::jsonb, 'public'),
  ('maintenance_mode', 'false'::jsonb, 'public')
ON CONFLICT ON CONSTRAINT configuration_key_scope_unique 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();