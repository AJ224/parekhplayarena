-- Insert Admin User Script
-- This script creates an admin user in the system

-- First, you need to create a user in Supabase Auth
-- Go to your Supabase Dashboard > Authentication > Users > Add User
-- Or use the Supabase CLI: supabase auth signup --email admin@example.com --password yourpassword

-- After creating the user in auth, get their UUID from the auth.users table
-- Then run this script to create the admin profile and assign admin role

-- Step 1: Insert user profile (replace 'USER_UUID_HERE' with actual UUID from auth.users)
INSERT INTO users (id, email, full_name, phone, created_at, updated_at)
VALUES (
  'USER_UUID_HERE', -- Replace with actual user UUID from auth.users
  'admin@example.com',
  'System Administrator',
  '+91-9876543210',
  NOW(),
  NOW()
);

-- Step 2: Insert admin user record
INSERT INTO admin_users (user_id, role, permissions, is_active, created_at, updated_at)
VALUES (
  'USER_UUID_HERE', -- Same UUID as above
  'super_admin',
  ARRAY['all'], -- Super admin has all permissions
  true,
  NOW(),
  NOW()
);

-- Alternative: Create admin with specific permissions
-- INSERT INTO admin_users (user_id, role, permissions, venue_ids, is_active, created_at, updated_at)
-- VALUES (
--   'USER_UUID_HERE',
--   'admin',
--   ARRAY['manage_bookings', 'manage_venues', 'view_analytics', 'manage_users'],
--   NULL, -- NULL means can manage all venues
--   true,
--   NOW(),
--   NOW()
-- );

-- Verify the admin user was created
SELECT 
  u.id,
  u.email,
  u.full_name,
  au.role,
  au.permissions,
  au.is_active
FROM users u
JOIN admin_users au ON u.id = au.user_id
WHERE u.email = 'admin@example.com';
