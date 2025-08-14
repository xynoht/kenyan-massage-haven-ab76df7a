-- Remove public read access from sensitive data tables
-- Keep only admin access for financial and personal data

-- Update bookings table policies - remove public access, keep admin and user-specific access
DROP POLICY IF EXISTS "Anyone can view their own bookings" ON public.bookings;

CREATE POLICY "Admin can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Update mpesa_transactions table policies - remove public read access  
DROP POLICY IF EXISTS "Allow read access to mpesa_transactions" ON public.mpesa_transactions;

-- Update payment_transactions table policies - remove public read access
DROP POLICY IF EXISTS "Anyone can view payment transactions" ON public.payment_transactions;

-- Update gift_vouchers table policies - remove public read access
DROP POLICY IF EXISTS "Anyone can view gift vouchers" ON public.gift_vouchers;

CREATE POLICY "Admin can view all gift vouchers" 
ON public.gift_vouchers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Add admin update policies for bookings and gift vouchers
CREATE POLICY "Admin can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

CREATE POLICY "Admin can update gift vouchers" 
ON public.gift_vouchers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);