-- Fix infinite recursion in admin_users RLS policies
-- This script fixes the circular dependency issue

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admin users can manage admin users" ON admin_users;

-- Option 1: Disable RLS for admin_users table (recommended for internal admin tables)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Alternative Option 2: If you want to keep RLS, use a simpler policy
-- (Uncomment the lines below if you prefer to keep RLS enabled)

-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- 
-- -- Create a simple policy that allows service role access
-- CREATE POLICY "Service role can manage admin users" ON admin_users FOR ALL 
--     USING (auth.role() = 'service_role');
-- 
-- -- Allow users to read their own admin status
-- CREATE POLICY "Users can read their own admin status" ON admin_users FOR SELECT 
--     USING (auth.uid() = user_id);

-- Verify the changes
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';
