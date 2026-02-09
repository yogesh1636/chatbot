# 🗄️ Supabase Database Setup Guide

## 📋 Step-by-Step Instructions

### 1. Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

---

## 🔧 SQL Commands to Run

### Option A: If Users Table Already Exists (UPDATE)

Run this command to add the new columns:

```sql
-- Add age and gender columns to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender VARCHAR(50);

-- Add age constraint (18+)
ALTER TABLE users
ADD CONSTRAINT age_check CHECK (age >= 18);

-- Add gender constraint (valid values only)
ALTER TABLE users
ADD CONSTRAINT gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'));
```

---

### Option B: If Creating Users Table from Scratch (CREATE)

Run this command to create the complete users table:

```sql
-- Create users table with all fields
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  gender VARCHAR(50) NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

---

## 📊 Verify Your Changes

Run this query to check the table structure:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

---

## 🔍 Test Data (Optional)

Insert a test user to verify everything works:

```sql
INSERT INTO users (username, email, age, gender, password)
VALUES ('testuser', 'test@example.com', 25, 'male', 'testpass123');

-- View the test user
SELECT * FROM users WHERE username = 'testuser';

-- Delete test user (optional)
-- DELETE FROM users WHERE username = 'testuser';
```

---

## 📝 Chat History Table (Already Exists)

If you need to verify or create the chat_history table:

```sql
-- Create chat_history table (if not exists)
CREATE TABLE IF NOT EXISTS chat_history (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  user_message TEXT NOT NULL,
  bot_reply TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_chat_history_username ON chat_history(username);

-- Create index for faster date sorting
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
```

---

## ✅ Final Checklist

- [ ] Users table has `age` column (INTEGER, NOT NULL, >= 18)
- [ ] Users table has `gender` column (VARCHAR, NOT NULL)
- [ ] Age constraint is active (prevents users under 18)
- [ ] Gender constraint is active (only valid values)
- [ ] Chat history table exists and is working
- [ ] Test signup works with new fields

---

## 🚨 Troubleshooting

### Error: "constraint already exists"
```sql
-- Drop existing constraints first
ALTER TABLE users DROP CONSTRAINT IF EXISTS age_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS gender_check;

-- Then add them again
ALTER TABLE users ADD CONSTRAINT age_check CHECK (age >= 18);
ALTER TABLE users ADD CONSTRAINT gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'));
```

### Error: "column already exists"
```sql
-- Check if columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('age', 'gender');
```

### Update Existing Users (if you have old data)
```sql
-- Set default values for existing users
UPDATE users 
SET age = 18, gender = 'prefer-not-to-say' 
WHERE age IS NULL OR gender IS NULL;
```

---

## 🎯 Quick Copy-Paste Command

For existing tables, just copy and paste this:

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender VARCHAR(50);

ALTER TABLE users
ADD CONSTRAINT age_check CHECK (age >= 18);

ALTER TABLE users
ADD CONSTRAINT gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'));
```

---

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in the dashboard
2. Verify your table permissions
3. Ensure RLS (Row Level Security) policies are configured if needed

---

**Done! Your database is now ready to accept age and gender data with proper validation! 🎉**
