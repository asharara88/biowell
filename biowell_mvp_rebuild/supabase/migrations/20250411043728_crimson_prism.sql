/*
  # Update coach_messages policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper checks
    - Add necessary indexes
    - Update constraints
    
  2. Security
    - Enable RLS
    - Add comprehensive policies for both authenticated and public access
*/

-- First, ensure RLS is enabled
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Users can read their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Service role has full access" ON coach_messages;
  DROP POLICY IF EXISTS "Allow all users to insert coach messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow all users to read coach messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow public to insert their own messages" ON coach_messages;
  DROP POLICY IF EXISTS "Allow public to read their own messages" ON coach_messages;
END $$;

-- Create new policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' AND policyname = 'Users can insert their own messages'
  ) THEN
    CREATE POLICY "Users can insert their own messages"
      ON coach_messages
      FOR INSERT
      TO authenticated
      WITH CHECK ((auth.uid() = user_id) AND (role = 'user'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' AND policyname = 'Users can read their own messages'
  ) THEN
    CREATE POLICY "Users can read their own messages"
      ON coach_messages
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access"
      ON coach_messages
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create or update indexes
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id ON coach_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_messages_created_at ON coach_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id_created_at ON coach_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coach_messages_content_gin ON coach_messages USING gin(to_tsvector('english', content));

-- Update constraints
ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_role_check,
  ADD CONSTRAINT coach_messages_role_check 
  CHECK (role IN ('user', 'coach'));

ALTER TABLE coach_messages 
  DROP CONSTRAINT IF EXISTS coach_messages_metadata_check,
  ADD CONSTRAINT coach_messages_metadata_check 
  CHECK (jsonb_typeof(metadata) = 'object');