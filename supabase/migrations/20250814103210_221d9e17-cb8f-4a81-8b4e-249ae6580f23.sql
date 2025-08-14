-- Add database indexes for frequently queried tables to improve performance

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_branch ON public.bookings (branch);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings (phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status_created_at ON public.bookings (status, created_at DESC);

-- Contact messages table indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_phone ON public.contact_messages (phone);

-- Gift vouchers table indexes
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_created_at ON public.gift_vouchers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_status ON public.gift_vouchers (status);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_payment_status ON public.gift_vouchers (payment_status);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_expires_at ON public.gift_vouchers (expires_at);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_voucher_code ON public.gift_vouchers (voucher_code);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_recipient_phone ON public.gift_vouchers (recipient_phone);

-- Payment transactions table indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions (status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_id ON public.payment_transactions (reference_id);

-- M-Pesa transactions table indexes
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_created_at ON public.mpesa_transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_status ON public.mpesa_transactions (status);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_checkout_request_id ON public.mpesa_transactions (checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_phone_number ON public.mpesa_transactions (phone_number);

-- Admin sessions table indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions (admin_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_bookings_date_branch ON public.bookings (date, branch);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_status_expires ON public.gift_vouchers (status, expires_at);