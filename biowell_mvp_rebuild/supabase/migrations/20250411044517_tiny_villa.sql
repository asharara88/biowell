/*
  # Fix Chat Message Policies

  1. Changes
    - Simplify RLS policies for coach_messages
    - Add public access policies for demo functionality
    - Ensure service role has proper access
    
  2. Security
    - Enable RLS
    - Add proper constraints
    - Create necessary indexes
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "authenticated_insert" ON coach_messages;
DROP POLICY IF EXISTS "authenticated_select" ON coach_messages;
DROP POLICY IF EXISTS "service_role_access" ON coach_messages;

-- Create public access policies (for demo functionality)
CREATE POLICY "public_insert"
  ON coach_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "public_select"
  ON coach_messages
  FOR SELECT
  TO public
  USING (true);

-- Create service role policy
CREATE POLICY "service_role_access"
  ON coach_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id ON coach_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_messages_created_at ON coach_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id_created_at ON coach_messages(user_id, created_at DESC);

-- Update constraints
ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_role_check,
  ADD CONSTRAINT coach_messages_role_check 
  CHECK (role IN ('user', 'coach'));

ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_metadata_check,
  ADD CONSTRAINT coach_messages_metadata_check 
  CHECK (jsonb_typeof(metadata) = 'object');