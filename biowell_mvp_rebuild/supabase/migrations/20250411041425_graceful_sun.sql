/*
  # Fix Coach Messages RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions
    - Add service role policy for AI coach responses
    
  2. Security
    - Maintain user data isolation
    - Allow service role to insert coach messages
    - Ensure proper role validation
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Users can read their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Service role has full access" ON coach_messages;

-- Create policy for users to insert their own messages
CREATE POLICY "Users can insert their own messages"
  ON coach_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    role = 'user'
  );

-- Create policy for users to read their own messages
CREATE POLICY "Users can read their own messages"
  ON coach_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for service role to have full access
CREATE POLICY "Service role has full access"
  ON coach_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id_created_at 
  ON coach_messages(user_id, created_at DESC);

-- Add constraints for data validation
ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_role_check,
  ADD CONSTRAINT coach_messages_role_check 
  CHECK (role IN ('user', 'coach'));

ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_metadata_check,
  ADD CONSTRAINT coach_messages_metadata_check 
  CHECK (jsonb_typeof(metadata) = 'object');