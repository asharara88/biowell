/*
  # Update CGM data user_id column

  1. Changes
    - Convert user_id column from text to UUID
    - Add NOT NULL constraint
    - Add foreign key constraint to auth.users
    - Update RLS policies
  
  2. Security
    - Temporarily disable RLS during migration
    - Re-enable RLS after changes
    - Recreate all policies with proper user authentication
*/

DO $$ 
BEGIN
  -- Temporarily disable RLS
  ALTER TABLE cgm_data DISABLE ROW LEVEL SECURITY;

  -- Drop existing foreign key if it exists
  ALTER TABLE cgm_data DROP CONSTRAINT IF EXISTS cgm_data_user_id_fkey;

  -- Convert user_id safely to UUID type
  ALTER TABLE cgm_data ADD COLUMN user_id_new UUID;
  UPDATE cgm_data SET user_id_new = user_id::UUID WHERE user_id IS NOT NULL;
  
  -- Drop the old column with CASCADE to remove dependent objects
  ALTER TABLE cgm_data DROP COLUMN user_id CASCADE;
  ALTER TABLE cgm_data RENAME COLUMN user_id_new TO user_id;

  -- Add NOT NULL constraint
  ALTER TABLE cgm_data ALTER COLUMN user_id SET NOT NULL;

  -- Add foreign key constraint referencing auth.users
  ALTER TABLE cgm_data
  ADD CONSTRAINT cgm_data_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
  ON DELETE CASCADE;

  -- Re-enable RLS explicitly
  ALTER TABLE cgm_data ENABLE ROW LEVEL SECURITY;

  -- Create comprehensive RLS policies
  CREATE POLICY "Users can access own CGM data"
    ON cgm_data
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own CGM data"
    ON cgm_data
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own CGM data"
    ON cgm_data
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete own CGM data"
    ON cgm_data
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;