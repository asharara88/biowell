/*
  # Create Habit Completion Schema

  1. New Tables
    - `habit_completions`
      - Track individual habit completion records
      - Store completion timestamp and metadata
      - Link to habits table
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view completions of their habits" ON habit_completions;
  DROP POLICY IF EXISTS "Users can create completions for their habits" ON habit_completions;
  DROP POLICY IF EXISTS "Users can delete completions of their habits" ON habit_completions;
END $$;

-- Create habit_completions table if it doesn't exist
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  notes text,
  mood text CHECK (mood IN ('great', 'good', 'neutral', 'difficult', 'challenging')),
  difficulty integer CHECK (difficulty BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'habit_completions' 
    AND policyname = 'Users can manage habit completions'
  ) THEN
    CREATE POLICY "Users can manage habit completions"
      ON habit_completions
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM habits
          JOIN habit_stacks ON habits.stack_id = habit_stacks.id
          WHERE habits.id = habit_completions.habit_id
          AND habit_stacks.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM habits
          JOIN habit_stacks ON habits.stack_id = habit_stacks.id
          WHERE habits.id = habit_id
          AND habit_stacks.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id 
  ON habit_completions(habit_id);

CREATE INDEX IF NOT EXISTS idx_habit_completions_completed_at 
  ON habit_completions(completed_at);

-- Add table comment
COMMENT ON TABLE habit_completions IS 'Tracks habit completion records with optional mood and difficulty ratings';