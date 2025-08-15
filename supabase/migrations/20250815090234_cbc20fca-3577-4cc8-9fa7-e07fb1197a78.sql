-- Remove existing admin users and create the specific ones
DELETE FROM public.admin_users;

-- Insert the two specific admin users with hashed passwords
INSERT INTO public.admin_users (id, email, password_hash, name, role, is_active) VALUES
(gen_random_uuid(), 'xynoht@gmail.com', crypt('priella2025', gen_salt('bf')), 'System Administrator', 'super_admin', true),
(gen_random_uuid(), 'tochiuimaria@gmail.com', crypt('priella2025', gen_salt('bf')), 'Doris Tochiu Imaria', 'super_admin', true);

-- Add constraint to only allow these specific email addresses
ALTER TABLE public.admin_users 
ADD CONSTRAINT valid_admin_emails 
CHECK (email IN ('xynoht@gmail.com', 'tochiuimaria@gmail.com'));