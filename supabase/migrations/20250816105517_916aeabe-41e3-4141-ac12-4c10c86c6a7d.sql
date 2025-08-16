-- First, let's check if we have any admin users and see their password hash structure
SELECT id, email, name, role, is_active, password_hash FROM public.admin_users LIMIT 5;

-- Update the admin user with a properly hashed password for the provided credentials
UPDATE public.admin_users 
SET password_hash = crypt('priella2025', gen_salt('bf'))
WHERE email = 'xynoht@gmail.com';

-- Also let's ensure the function works by testing it
-- First create a test if needed
INSERT INTO public.admin_users (email, password_hash, name, role, is_active)
VALUES ('xynoht@gmail.com', crypt('priella2025', gen_salt('bf')), 'Admin User', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET 
password_hash = crypt('priella2025', gen_salt('bf')),
is_active = true;