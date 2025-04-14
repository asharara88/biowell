/*
  # Fix coach_messages RLS policies

  1. Changes
    - Simplify RLS policies
    - Add proper constraints
    - Update indexes
  
  2. Security
    - Enable RLS
    - Allow authenticated users to manage their messages
    - Allow service role full access for AI responses
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "authenticated_insert" ON coach_messages;
  DROP POLICY IF EXISTS "authenticated_select" ON coach_messages;
  DROP POLICY IF EXISTS "service_role_access" ON coach_messages;
END $$;

-- Create simplified policies
CREATE POLICY "authenticated_insert"
  ON coach_messages
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.uid() = user_id) AND (role = 'user'));

CREATE POLICY "authenticated_select"
  ON coach_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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