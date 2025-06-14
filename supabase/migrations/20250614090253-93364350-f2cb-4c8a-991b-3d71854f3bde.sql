
-- Clear all existing booking data and related records (only from actual tables)
DELETE FROM bookings;
DELETE FROM contact_messages; 
DELETE FROM gift_vouchers;
DELETE FROM mpesa_transactions;
DELETE FROM payment_transactions;

-- Clear admin analytics table (this is a real table, not a view)
DELETE FROM admin_analytics;

-- Note: The other tables (booking_analytics, branch_performance, daily_performance, 
-- monthly_revenue_trends, service_duration_analytics) are views that automatically 
-- update based on the data in the main tables, so they don't need to be cleared manually.
