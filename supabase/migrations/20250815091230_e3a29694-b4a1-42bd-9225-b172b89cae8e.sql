-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the authenticate_admin function to use the correct password verification
CREATE OR REPLACE FUNCTION public.authenticate_admin(email_input text, password_input text)
RETURNS TABLE(admin_id uuid, email text, name text, role admin_role, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.name,
    au.role,
    au.is_active
  FROM public.admin_users au
  WHERE au.email = email_input 
    AND au.password_hash = crypt(password_input, au.password_hash)
    AND au.is_active = true;
END;
$function$;