/*
  # Update CGM data user_id column

  1. Changes
    - Convert user_id from TEXT to UUID
    - Add foreign key constraint to auth.users
    - Update RLS policies to use UUID comparison
  
  2. Security
    - Temporarily disable and re-enable RLS
    - Recreate all access policies
    - Ensure proper user data isolation
*/

DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can read own CGM data" ON cgm_data;
  DROP POLICY IF EXISTS "Users can insert own CGM data" ON cgm_data;
  DROP POLICY IF EXISTS "Users can update own CGM data" ON cgm_data;
  DROP POLICY IF EXISTS "Users can delete own CGM data" ON cgm_data;

  -- Temporarily disable RLS
  ALTER TABLE cgm_data DISABLE ROW LEVEL SECURITY;

  -- Drop existing foreign key if it exists
  ALTER TABLE cgm_data DROP CONSTRAINT IF EXISTS cgm_data_user_id_fkey;

  -- Ensure user_id can safely convert to UUID
  ALTER TABLE cgm_data ADD COLUMN user_id_new UUID;

  -- Convert existing user_id (assuming text) to UUID explicitly
  UPDATE cgm_data
  SET user_id_new = user_id::UUID;

  -- Drop old user_id column
  ALTER TABLE cgm_data DROP COLUMN user_id;

  -- Rename the new column
  ALTER TABLE cgm_data RENAME COLUMN user_id_new TO user_id;

  -- Add NOT NULL constraint
  ALTER TABLE cgm_data ALTER COLUMN user_id SET NOT NULL;

  -- Add foreign key constraint linking to auth.users
  ALTER TABLE cgm_data
  ADD CONSTRAINT cgm_data_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
  ON DELETE CASCADE;

  -- Re-enable RLS explicitly
  ALTER TABLE cgm_data ENABLE ROW LEVEL SECURITY;

  -- Recreate necessary policies explicitly
  CREATE POLICY "Users can access own CGM data"
  ON cgm_data
  FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own CGM data"
  ON cgm_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own CGM data"
  ON cgm_data
  FOR UPDATE USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete own CGM data"
  ON cgm_data
  FOR DELETE USING (auth.uid() = user_id);
END $$;