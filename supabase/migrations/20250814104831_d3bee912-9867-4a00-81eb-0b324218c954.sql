-- Fix RLS policies for tables that have RLS enabled but no policies

-- Create RLS policies for booking_notifications table
CREATE POLICY "Admin can manage all booking notifications" 
ON public.booking_notifications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.admin_id = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Create RLS policies for mpesa_transactions table  
CREATE POLICY "Admin can manage all mpesa transactions" 
ON public.mpesa_transactions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.admin_id = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Create RLS policies for payment_transactions table
CREATE POLICY "Admin can manage all payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.admin_id = auth.uid()::text 
    AND admin_users.is_active = true
  )
);

-- Fix security definer views by dropping and recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.booking_analytics CASCADE;
DROP VIEW IF EXISTS public.revenue_analytics CASCADE;
DROP VIEW IF EXISTS public.customer_analytics CASCADE;
DROP VIEW IF EXISTS public.admin_dashboard_stats CASCADE;
DROP VIEW IF EXISTS public.monthly_revenue_trend CASCADE;

-- Recreate views without SECURITY DEFINER (they will use SECURITY INVOKER by default)
CREATE VIEW public.booking_analytics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
  AVG(total_amount) as avg_booking_value,
  SUM(total_amount) as total_revenue
FROM public.bookings 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

CREATE VIEW public.revenue_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  SUM(total_amount) as daily_revenue,
  COUNT(*) as booking_count,
  AVG(total_amount) as avg_booking_value
FROM public.bookings 
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

CREATE VIEW public.customer_analytics AS
SELECT 
  customer_phone,
  customer_name,
  COUNT(*) as total_bookings,
  SUM(total_amount) as total_spent,
  MAX(created_at) as last_booking_date,
  AVG(total_amount) as avg_booking_value
FROM public.bookings
GROUP BY customer_phone, customer_name
ORDER BY total_spent DESC;

CREATE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.bookings) as total_bookings,
  (SELECT COUNT(*) FROM public.bookings WHERE status = 'pending') as pending_bookings,
  (SELECT COUNT(*) FROM public.contact_messages WHERE status = 'new') as new_messages,
  (SELECT COUNT(*) FROM public.gift_vouchers) as total_vouchers,
  (SELECT COALESCE(SUM(total_amount), 0) FROM public.bookings WHERE status = 'confirmed') as total_revenue;

CREATE VIEW public.monthly_revenue_trend AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(total_amount) as revenue,
  COUNT(*) as booking_count
FROM public.bookings 
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC
LIMIT 12;

-- Fix functions by setting search_path parameter
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.generate_voucher_code() SET search_path = public;
ALTER FUNCTION public.check_booking_time_slot() SET search_path = public;
ALTER FUNCTION public.validate_admin_session() SET search_path = public;
ALTER FUNCTION public.cleanup_expired_sessions() SET search_path = public;
ALTER FUNCTION public.get_available_time_slots(date, text) SET search_path = public;
ALTER FUNCTION public.validate_gift_voucher_usage() SET search_path = public;