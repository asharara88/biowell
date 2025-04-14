/*
  # Update environment configuration

  1. Changes
    - Add environment variables to configuration table
    - Set up secure defaults
    - Add validation constraints
  
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Insert or update environment configuration
INSERT INTO configuration (key, value, scope)
VALUES 
  (
    'openai_config',
    jsonb_build_object(
      'api_key', current_setting('app.settings.openai_api_key', true),
      'model', 'gpt-4',
      'temperature', 0.7,
      'max_tokens', 500
    ),
    'service'
  ),
  (
    'supabase_config',
    jsonb_build_object(
      'url', current_setting('app.settings.supabase_url', true),
      'anon_key', current_setting('app.settings.supabase_anon_key', true)
    ),
    'public'
  )
ON CONFLICT (key, scope) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_configuration_key_scope 
  ON configuration(key, scope);

-- Add validation constraints
ALTER TABLE configuration
  DROP CONSTRAINT IF EXISTS configuration_scope_check,
  ADD CONSTRAINT configuration_scope_check
  CHECK (scope IN ('public', 'service', 'private'));

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read public configurations" ON configuration;
DROP POLICY IF EXISTS "Service role has full access to configurations" ON configuration;

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