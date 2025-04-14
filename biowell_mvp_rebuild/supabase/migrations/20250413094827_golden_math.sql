/*
  # Add tracking method to user preferences

  1. Changes
    - Add `tracking_method` column to `user_preferences` table
      - Type: TEXT
      - Default: 'manual'
      - Allowed values: 'manual', 'wearable', 'both'
      - Not nullable
  
  2. Security
    - No changes to RLS policies needed as the table already has appropriate policies
*/

ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS tracking_method TEXT 
  NOT NULL 
  DEFAULT 'manual'
  CHECK (tracking_method IN ('manual', 'wearable', 'both'));

-- Update existing rows to have the default value
UPDATE user_preferences 
SET tracking_method = 'manual' 
WHERE tracking_method IS NULL;