/*
  # Add coach messages table

  1. New Tables
    - `coach_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `role` (text, either 'user' or 'coach')
      - `metadata` (jsonb, for additional message data)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `coach_messages` table
    - Add policies for authenticated users to manage their messages
*/

CREATE TABLE IF NOT EXISTS coach_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'coach')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own messages"
  ON coach_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own messages"
  ON coach_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_coach_messages_user_id ON coach_messages(user_id);
CREATE INDEX idx_coach_messages_created_at ON coach_messages(created_at);