-- SQL Commands to Update Supabase Database
-- Run these commands in Supabase SQL Editor

-- 1. Add age and gender columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender VARCHAR(50);

-- 2. Add constraints for age (must be 18 or older)
ALTER TABLE users
ADD CONSTRAINT age_check CHECK (age >= 18);

-- 3. Add constraint for gender (optional - ensures valid values)
ALTER TABLE users
ADD CONSTRAINT gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'));

-- 4. Update existing users with default values (optional)
-- UPDATE users SET age = 18, gender = 'prefer-not-to-say' WHERE age IS NULL;

-- 5. Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';
