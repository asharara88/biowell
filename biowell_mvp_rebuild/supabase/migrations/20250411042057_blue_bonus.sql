/*
  # Fix Coach Messages RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies for authenticated users and service role
    - Add proper constraints and indexes
    
  2. Security
    - Enable RLS
    - Ensure users can only insert messages with role='user'
    - Allow service role full access for AI responses
    - Add proper validation constraints
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Users can read their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Service role has full access" ON coach_messages;
DROP POLICY IF EXISTS "Allow users to insert their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Allow users to read their own messages" ON coach_messages;

-- Create policy for public access (unauthenticated)
CREATE POLICY "Allow public to insert their own messages"
  ON coach_messages
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = user_id AND
    role = 'user'
  );

CREATE POLICY "Allow public to read their own messages"
  ON coach_messages
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Create policy for authenticated users
CREATE POLICY "Users can insert their own messages"
  ON coach_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    role = 'user'
  );

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