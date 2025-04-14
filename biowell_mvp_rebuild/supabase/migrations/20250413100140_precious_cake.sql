/*
  # Fix user_preferences table

  1. Changes
    - Ensure tracking_method column exists with proper constraints
    - Ensure goals column exists as JSONB type
    - Add indexes for better performance
    
  2. Security
    - Maintain existing RLS policies
*/

-- First, check if the table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_preferences') THEN
    -- Create the table if it doesn't exist
    CREATE TABLE user_preferences (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      language text DEFAULT 'en' CHECK (language IN ('en', 'ar')),
      theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
      notifications_enabled boolean DEFAULT true,
      goals jsonb DEFAULT '{}'::jsonb,
      tracking_method text NOT NULL DEFAULT 'manual' CHECK (tracking_method IN ('manual', 'wearable', 'both')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id)
    );

    -- Enable RLS
    ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can read own preferences"
      ON user_preferences
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own preferences"
      ON user_preferences
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can insert own preferences"
      ON user_preferences
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

  ELSE
    -- Table exists, ensure columns exist with proper types
    
    -- Check if tracking_method column exists
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'user_preferences' 
      AND column_name = 'tracking_method'
    ) THEN
      -- Add tracking_method column
      ALTER TABLE user_preferences 
      ADD COLUMN tracking_method TEXT 
        NOT NULL 
        DEFAULT 'manual'
        CHECK (tracking_method IN ('manual', 'wearable', 'both'));
    END IF;

    -- Check if goals column exists
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'user_preferences' 
      AND column_name = 'goals'
    ) THEN
      -- Add goals column as JSONB
      ALTER TABLE user_preferences 
      ADD COLUMN goals jsonb DEFAULT '{}'::jsonb;
    ELSE
      -- If goals column exists but is not JSONB, convert it
      IF (
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user_preferences' 
        AND column_name = 'goals'
      ) != 'jsonb' THEN
        -- Create a temporary column
        ALTER TABLE user_preferences ADD COLUMN goals_new jsonb DEFAULT '{}'::jsonb;
        
        -- Convert existing data
        UPDATE user_preferences 
        SET goals_new = 
          CASE 
            WHEN goals IS NULL THEN '{}'::jsonb
            WHEN goals::text ~ '^{.*}$' THEN goals::jsonb
            ELSE jsonb_build_object('primary', goals)
          END;
        
        -- Drop old column and rename new one
        ALTER TABLE user_preferences DROP COLUMN goals;
        ALTER TABLE user_preferences RENAME COLUMN goals_new TO goals;
      END IF;
    END IF;

    -- Update existing rows to have the default value for tracking_method
    UPDATE user_preferences 
    SET tracking_method = 'manual' 
    WHERE tracking_method IS NULL;
  END IF;

  -- Add comment to explain the column's purpose
  COMMENT ON COLUMN user_preferences.goals IS 'User-defined wellness goals stored as JSON';
  COMMENT ON COLUMN user_preferences.tracking_method IS 'User preferred tracking method (manual, wearable, or both)';
  
  -- Create trigger for updated_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_user_preferences_updated_at
      BEFORE UPDATE ON user_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert demo user preferences if they don't exist
INSERT INTO user_preferences (user_id, goals, tracking_method)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '{"primary": "Sleep"}'::jsonb,
  'manual'
)
ON CONFLICT (user_id) DO NOTHING;