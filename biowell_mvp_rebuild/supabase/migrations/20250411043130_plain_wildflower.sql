/*
  # Fix coach_messages table and policies

  1. Changes
    - Ensure coach_messages table exists with correct structure
    - Update foreign key constraint
    - Fix RLS policies
    
  2. Security
    - Enable RLS
    - Add proper policies for user access
*/

-- Create coach_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS coach_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'coach')),
  metadata jsonb DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Users can read their own messages" ON coach_messages;
DROP POLICY IF EXISTS "Service role has full access" ON coach_messages;

-- Create new policies
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

CREATE POLICY "Service role has full access"
  ON coach_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id_created_at 
  ON coach_messages(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coach_messages_content_gin 
  ON coach_messages USING gin(to_tsvector('english', content));