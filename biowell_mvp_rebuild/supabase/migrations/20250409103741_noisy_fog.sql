/*
  # Update coach messages table policies

  1. Changes
    - Add IF NOT EXISTS checks for policies
    - Ensure policies are only created if they don't already exist
    - Maintain existing table structure and indexes

  2. Security
    - Maintain RLS policies for user data access
    - Keep existing service role access
*/

DO $$ BEGIN
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' 
    AND policyname = 'Users can insert their own messages'
  ) THEN
    CREATE POLICY "Users can insert their own messages"
      ON public.coach_messages
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' 
    AND policyname = 'Users can read their own messages'
  ) THEN
    CREATE POLICY "Users can read their own messages"
      ON public.coach_messages
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coach_messages' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access"
      ON public.coach_messages
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

END $$;