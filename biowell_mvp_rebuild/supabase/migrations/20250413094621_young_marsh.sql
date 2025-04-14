/*
  # Convert goals column to JSONB type

  1. Changes
    - Alter goals column from text to JSONB type
    - Set default value to empty JSON object
    - Maintain existing RLS policies
    
  2. Security
    - Preserve existing RLS policies
*/

-- First, check if the column exists as text type
DO $$ 
BEGIN
  -- If the column exists as text type, convert it to JSONB
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_preferences' 
    AND column_name = 'goals' 
    AND data_type = 'text'
  ) THEN
    -- Alter the column type to JSONB
    ALTER TABLE user_preferences 
    ALTER COLUMN goals TYPE jsonb USING COALESCE(goals::jsonb, '{}'::jsonb);
  
  -- If the column doesn't exist, create it as JSONB
  ELSIF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_preferences' 
    AND column_name = 'goals'
  ) THEN
    ALTER TABLE user_preferences 
    ADD COLUMN goals jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  -- Update the comment
  COMMENT ON COLUMN user_preferences.goals IS 'User-defined wellness goals stored as JSON';
END $$;