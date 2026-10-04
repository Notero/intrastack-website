-- 0012_seed_admin.sql
-- Promote your own user to admin.
--
-- HOW TO USE
--   1. Create the user in the Supabase dashboard (Authentication → Users
--      → "Add user" → email + password). The handle_new_user() trigger
--      will auto-create a profiles row with role = 'applicant'.
--   2. Replace the email below and run this file in the SQL editor.
--   3. The role-sync trigger will move the user into admin_profiles.
--
-- After this, any further admin promotions can be done from inside the app
-- (admin dashboard) or by running an UPDATE on profiles directly.

update public.profiles
   set role = 'admin'
 where email = 'REPLACE_WITH_YOUR_EMAIL@example.com';
