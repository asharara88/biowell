/*
  # Add tracking_method column to user_preferences table

  1. Changes
    - Add tracking_method column to user_preferences table
    - Set default value to 'manual'
    - Add check constraint for valid values
    - Make column not nullable
    
  2. Security
    - No changes to RLS policies needed
*/

-- Add tracking_method column if it doesn't exist
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS tracking_method TEXT 
  NOT NULL 
  DEFAULT 'manual'
  CHECK (tracking_method IN ('manual', 'wearable', 'both'));

-- Update existing rows to have the default value
UPDATE user_preferences 
SET tracking_method = 'manual' 
WHERE tracking_method IS NULL;