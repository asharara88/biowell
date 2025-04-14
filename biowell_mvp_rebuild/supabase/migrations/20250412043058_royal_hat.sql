/*
  # Add date column and new metric columns to health_metrics table

  1. Changes
    - Add timestamp column for date tracking
    - Add new health metric columns with constraints
    - Add indexes for performance optimization
    
  2. Security
    - Add proper constraints for data validation
    - Create indexes for common queries
*/

-- Add timestamp column for date tracking
ALTER TABLE health_metrics
  ADD COLUMN IF NOT EXISTS metric_date timestamp with time zone DEFAULT now();

-- Add new columns with validation constraints
ALTER TABLE health_metrics
  ADD COLUMN IF NOT EXISTS steps_count INTEGER CHECK (steps_count >= 0),
  ADD COLUMN IF NOT EXISTS calories_burned INTEGER CHECK (calories_burned >= 0),
  ADD COLUMN IF NOT EXISTS workout_minutes INTEGER CHECK (workout_minutes >= 0),
  ADD COLUMN IF NOT EXISTS hrv_avg REAL CHECK (hrv_avg >= 0),
  ADD COLUMN IF NOT EXISTS hrv_variability REAL CHECK (hrv_variability >= 0),
  ADD COLUMN IF NOT EXISTS avg_glucose REAL CHECK (avg_glucose >= 0),
  ADD COLUMN IF NOT EXISTS glucose_variability REAL CHECK (glucose_variability >= 0);

-- Add column comments
COMMENT ON COLUMN health_metrics.metric_date IS 'Timestamp when metrics were recorded';
COMMENT ON COLUMN health_metrics.steps_count IS 'Daily step count from wearable devices';
COMMENT ON COLUMN health_metrics.calories_burned IS 'Total calories burned for the day';
COMMENT ON COLUMN health_metrics.workout_minutes IS 'Total minutes of exercise activity';
COMMENT ON COLUMN health_metrics.hrv_avg IS 'Average Heart Rate Variability measurement';
COMMENT ON COLUMN health_metrics.hrv_variability IS 'Variability in HRV measurements';
COMMENT ON COLUMN health_metrics.avg_glucose IS 'Average glucose level for the period';
COMMENT ON COLUMN health_metrics.glucose_variability IS 'Measure of glucose level fluctuation';

-- Create indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_health_metrics_steps 
  ON health_metrics(user_id, metric_date, steps_count);

CREATE INDEX IF NOT EXISTS idx_health_metrics_glucose 
  ON health_metrics(user_id, metric_date, avg_glucose);

CREATE INDEX IF NOT EXISTS idx_health_metrics_hrv 
  ON health_metrics(user_id, metric_date, hrv_avg);