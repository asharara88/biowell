/*
  # Convert CGM user_id to text type

  1. Changes
    - Convert user_id column from current type to text
    - Preserve existing RLS policies
    
  2. Security
    - Temporarily drops RLS policies
    - Recreates policies after column conversion
*/

DO $$ 
BEGIN
  -- Drop existing RLS policies
  DROP POLICY IF EXISTS "Users can read own CGM data" ON cgm_data;
  DROP POLICY IF EXISTS "Users can insert own CGM data" ON cgm_data;
  
  -- Temporarily disable RLS
  ALTER TABLE cgm_data DISABLE ROW LEVEL SECURITY;
  
  -- Create a temporary column for the conversion
  ALTER TABLE cgm_data ADD COLUMN user_id_new text;
  
  -- Update the new column with converted values
  UPDATE cgm_data 
  SET user_id_new = user_id::text 
  WHERE user_id IS NOT NULL;
  
  -- Drop the old column
  ALTER TABLE cgm_data DROP COLUMN user_id;
  
  -- Rename the new column
  ALTER TABLE cgm_data RENAME COLUMN user_id_new TO user_id;
  
  -- Set NOT NULL constraint
  ALTER TABLE cgm_data ALTER COLUMN user_id SET NOT NULL;
  
  -- Re-enable RLS
  ALTER TABLE cgm_data ENABLE ROW LEVEL SECURITY;

  -- Recreate the policies
  CREATE POLICY "Users can read own CGM data"
    ON cgm_data
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id);

  CREATE POLICY "Users can insert own CGM data"
    ON cgm_data
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = user_id);
END $$;