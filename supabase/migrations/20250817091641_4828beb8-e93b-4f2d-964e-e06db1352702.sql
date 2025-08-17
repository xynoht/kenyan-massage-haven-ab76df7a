-- Enable pgcrypto extension (required for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update authenticate_admin function to use proper password comparison
CREATE OR REPLACE FUNCTION public.authenticate_admin(email_input text, password_input text)
RETURNS TABLE(admin_id uuid, email text, name text, role admin_role, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Test data generation for demonstration
-- Insert a test booking
INSERT INTO public.bookings (name, phone, email, date, time, duration, branch, total_amount, status, notes)
VALUES 
  ('John Doe', '254712345678', 'john@example.com', '2025-08-20', '14:00', 30, 'the-hub-karen', 1000, 'confirmed', 'Test booking for demonstration'),
  ('Jane Smith', '254723456789', 'jane@example.com', '2025-08-21', '15:30', 45, 'the-hub-karen', 1500, 'pending', 'Another test booking');

-- Insert a test gift voucher
INSERT INTO public.gift_vouchers (sender_name, recipient_name, recipient_phone, amount, branch, message, status, payment_status)
VALUES 
  ('Alice Johnson', 'Bob Wilson', '254734567890', 1000, 'the-hub-karen', 'Happy Birthday! Enjoy your relaxing massage session.', 'active', 'completed'),
  ('Mary Brown', 'Sarah Davis', '254745678901', 1500, 'the-hub-karen', 'Thank you for all your hard work!', 'active', 'pending');

-- Insert additional contact messages for testing
INSERT INTO public.contact_messages (name, phone, message, status)
VALUES 
  ('David Lee', '254756789012', 'I would like to know more about your 45-minute sessions and availability for this weekend.', 'new'),
  ('Grace Wanjiku', '254767890123', 'Excellent service! I had my session yesterday and feel completely refreshed. Will definitely be back!', 'read');