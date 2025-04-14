/*
  # Add Habit Stacks Schema

  1. New Tables
    - `habit_stacks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `habits`
      - `id` (uuid, primary key)
      - `stack_id` (uuid, references habit_stacks)
      - `name` (text)
      - `description` (text)
      - `frequency` (text)
      - `time_of_day` (text[])
      - `duration_minutes` (integer)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `habit_completions`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, references habits)
      - `completed_at` (timestamp)
      - `notes` (text)
      - `mood` (text)
      - `difficulty` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create habit_stacks table
CREATE TABLE IF NOT EXISTS habit_stacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_id uuid REFERENCES habit_stacks(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'weekdays', 'weekends')),
  time_of_day text[] DEFAULT ARRAY['morning'],
  duration_minutes integer DEFAULT 15,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  notes text,
  mood text CHECK (mood IN ('great', 'good', 'neutral', 'difficult', 'challenging')),
  difficulty integer CHECK (difficulty BETWEEN 1 AND 5)
);

-- Enable Row Level Security
ALTER TABLE habit_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for habit_stacks
CREATE POLICY "Users can view own habit stacks"
  ON habit_stacks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habit stacks"
  ON habit_stacks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit stacks"
  ON habit_stacks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit stacks"
  ON habit_stacks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for habits
CREATE POLICY "Users can view habits in their stacks"
  ON habits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habit_stacks
      WHERE habit_stacks.id = habits.stack_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create habits in their stacks"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habit_stacks
      WHERE habit_stacks.id = stack_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update habits in their stacks"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habit_stacks
      WHERE habit_stacks.id = habits.stack_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete habits in their stacks"
  ON habits
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habit_stacks
      WHERE habit_stacks.id = habits.stack_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

-- Create policies for habit_completions
CREATE POLICY "Users can view completions of their habits"
  ON habit_completions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits
      JOIN habit_stacks ON habits.stack_id = habit_stacks.id
      WHERE habits.id = habit_completions.habit_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create completions for their habits"
  ON habit_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      JOIN habit_stacks ON habits.stack_id = habit_stacks.id
      WHERE habits.id = habit_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update completions of their habits"
  ON habit_completions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits
      JOIN habit_stacks ON habits.stack_id = habit_stacks.id
      WHERE habits.id = habit_completions.habit_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete completions of their habits"
  ON habit_completions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits
      JOIN habit_stacks ON habits.stack_id = habit_stacks.id
      WHERE habits.id = habit_completions.habit_id
      AND habit_stacks.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habit_stacks_user_id ON habit_stacks(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_stack_id ON habits(stack_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habits_order ON habits("order");
CREATE INDEX IF NOT EXISTS idx_habit_completions_completed_at ON habit_completions(completed_at);