-- Fix service role permissions for all admin tables
-- This script ensures the service role has proper access to all necessary tables

-- Grant usage on schema public to service_role
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant all privileges on all tables to service_role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant sequence privileges if there are any sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Verify the permissions for key tables
SELECT 
    schemaname,
    tablename,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'SELECT') as can_select,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'INSERT') as can_insert,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'UPDATE') as can_update,
    has_table_privilege('service_role', schemaname||'.'||tablename, 'DELETE') as can_delete
FROM pg_tables 
WHERE tablename IN ('admin_users', 'venues', 'locations', 'cities', 'sports', 'bookings')
ORDER BY tablename;
