/*
  # Rename glucose_level column to glucose

  1. Changes
    - Rename `glucose_level` to `glucose` in `cgm_data` table
  
  2. Security
    - Temporarily disable RLS during the operation
    - Re-enable RLS after completion
*/

DO $$ 
BEGIN
  -- Temporarily disable RLS
  ALTER TABLE cgm_data DISABLE ROW LEVEL SECURITY;
  
  -- Rename the column
  ALTER TABLE cgm_data 
    RENAME COLUMN glucose_level TO glucose;
  
  -- Re-enable RLS
  ALTER TABLE cgm_data ENABLE ROW LEVEL SECURITY;
END $$;