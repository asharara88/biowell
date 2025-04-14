/*
  # Add goals column to user_preferences table

  1. Changes
    - Add goals column to user_preferences table
    - Set default value to NULL
    - Allow NULL values
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add goals column to user_preferences table
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS goals text;

-- Add comment to explain the column's purpose
COMMENT ON COLUMN user_preferences.goals IS 'User-defined wellness goals';