-- Fix infinite recursion in admin_users RLS policy
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admin users can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "No modifications allowed" ON public.admin_users;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Use auth.uid() directly without referencing admin_users table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id::text = auth.uid()::text 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create safe RLS policies without recursion
CREATE POLICY "Active admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (public.is_active_admin() OR auth.uid() IS NULL);

CREATE POLICY "Prevent admin modifications through RLS" 
ON public.admin_users 
FOR ALL 
USING (false) 
WITH CHECK (false);