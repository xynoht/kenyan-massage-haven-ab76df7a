-- Drop all existing policies on bookings table to start fresh
DROP POLICY IF EXISTS "Enable insert for all users" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public booking creation" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin access to bookings" ON public.bookings;

-- Disable RLS temporarily to test
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies
CREATE POLICY "allow_public_insert" ON public.bookings
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "allow_admin_select" ON public.bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "allow_admin_update" ON public.bookings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

-- Test inserting a booking to verify policies work
INSERT INTO public.bookings (
  name, phone, email, date, time, duration, branch, total_amount, status
) VALUES (
  'Policy Test', '254700123456', 'test@example.com', 
  '2024-12-30', '14:00', 45, 'Nairobi CBD', 1500, 'pending'
);

-- Clean up test booking
DELETE FROM public.bookings WHERE name = 'Policy Test';