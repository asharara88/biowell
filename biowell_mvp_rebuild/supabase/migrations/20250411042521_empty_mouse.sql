/*
  # Add demo user

  1. Changes
    - Insert demo user with ID '550e8400-e29b-41d4-a716-446655440000'
    
  2. Notes
    - This user is required for the demo functionality of the coach chat
    - The user ID matches the DEMO_USER_ID constant in PersonalCoachChat.tsx
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = '550e8400-e29b-41d4-a716-446655440000'
  ) THEN
    INSERT INTO users (
      id,
      email
    ) VALUES (
      '550e8400-e29b-41d4-a716-446655440000',
      'demo@example.com'
    );
  END IF;
END $$;