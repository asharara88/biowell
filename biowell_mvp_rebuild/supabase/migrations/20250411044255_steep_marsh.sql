/*
  # Fix coach_messages RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies for authenticated users and service role
    - Update indexes for better performance
  
  2. Security
    - Enable RLS
    - Ensure proper user data isolation
    - Allow service role full access for AI responses
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Users can read their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Service role has full access" ON coach_messages;
  DROP POLICY IF EXISTS "Allow users to insert their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow users to read their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow all users to insert coach messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow all users to read coach messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow public to insert their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow public to read their own messages" ON coach_messages;
END $$;

-- Create new policies
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

-- Create or update indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coach_messages_user_id') THEN
    CREATE INDEX idx_coach_messages_user_id ON coach_messages(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coach_messages_created_at') THEN
    CREATE INDEX idx_coach_messages_created_at ON coach_messages(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coach_messages_user_id_created_at') THEN
    CREATE INDEX idx_coach_messages_user_id_created_at ON coach_messages(user_id, created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coach_messages_content_gin') THEN
    CREATE INDEX idx_coach_messages_content_gin ON coach_messages USING gin(to_tsvector('english', content));
  END IF;
END $$;