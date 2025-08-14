-- Fix RLS policies and security issues

-- Create RLS policies for mpesa_transactions table (only allow admins)
CREATE POLICY "Admin can manage all mpesa transactions" 
ON public.mpesa_transactions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Create RLS policies for payment_transactions table (only allow admins)
CREATE POLICY "Admin can manage all payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Allow admin to view contact messages
CREATE POLICY "Admin can view all contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Allow admin to update contact messages
CREATE POLICY "Admin can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id::text = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Fix functions by setting search_path parameter
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.generate_voucher_code() SET search_path = public;
ALTER FUNCTION public.set_voucher_code() SET search_path = public;
ALTER FUNCTION public.authenticate_admin(text, text) SET search_path = public;
ALTER FUNCTION public.create_admin_session(uuid) SET search_path = public;
ALTER FUNCTION public.create_admin_user(text, text, text, admin_role) SET search_path = public;
ALTER FUNCTION public.get_analytics_summary(date, date) SET search_path = public;