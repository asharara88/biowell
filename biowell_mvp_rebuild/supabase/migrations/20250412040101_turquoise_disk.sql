/*
  # Fix coach_messages policies

  1. Changes
    - Add IF NOT EXISTS checks for policies
    - Ensure policies are only created if they don't already exist
    - Maintain existing table structure and indexes
    
  2. Security
    - Maintain RLS policies for user data access
    - Keep existing service role access
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "public_insert" ON coach_messages;
  DROP POLICY IF EXISTS "public_select" ON coach_messages;
  DROP POLICY IF EXISTS "service_role_access" ON coach_messages;

  -- Create new policies with proper checks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' 
    AND policyname = 'public_insert'
  ) THEN
    CREATE POLICY "public_insert"
      ON coach_messages
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' 
    AND policyname = 'public_select'
  ) THEN
    CREATE POLICY "public_select"
      ON coach_messages
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' 
    AND policyname = 'service_role_access'
  ) THEN
    CREATE POLICY "service_role_access"
      ON coach_messages
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Ensure indexes exist
  CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id 
    ON coach_messages(user_id);

  CREATE INDEX IF NOT EXISTS idx_coach_messages_created_at 
    ON coach_messages(created_at);

  CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id_created_at 
    ON coach_messages(user_id, created_at DESC);

  -- Add full-text search index if it doesn't exist
  CREATE INDEX IF NOT EXISTS idx_coach_messages_content_gin 
    ON coach_messages USING gin(to_tsvector('english', content));

  -- Add comment to table
  COMMENT ON TABLE coach_messages IS 'Stores chat messages between users and the AI coach';
END $$;