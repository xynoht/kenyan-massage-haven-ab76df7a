-- Fix the RLS policy for bookings table to allow public insertions
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a more permissive policy for inserting bookings
CREATE POLICY "Enable insert for all users" ON public.bookings
FOR INSERT 
TO public
WITH CHECK (true);

-- Also ensure we have proper policies for reading bookings
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings" ON public.bookings
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Keep the update policy for admins
DROP POLICY IF EXISTS "Admin can update bookings" ON public.bookings;

CREATE POLICY "Admins can update bookings" ON public.bookings
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);