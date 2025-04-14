/*
  # Update coach_messages table policies

  1. Changes
    - Add comprehensive policies for coach_messages table
    - Ensure proper access control for authenticated users
    - Add service role access for AI coach functionality
  
  2. Security
    - Enable RLS
    - Add policies for:
      - User message insertion
      - Message reading
      - Service role access
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
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
-- This is needed for the AI coach to insert responses
CREATE POLICY "Service role has full access"
  ON coach_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id_created_at 
  ON coach_messages(user_id, created_at DESC);

-- Add constraint to ensure valid role values
ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_role_check,
  ADD CONSTRAINT coach_messages_role_check 
  CHECK (role IN ('user', 'coach'));

-- Add constraint to ensure valid metadata format
ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_metadata_check,
  ADD CONSTRAINT coach_messages_metadata_check 
  CHECK (jsonb_typeof(metadata) = 'object');