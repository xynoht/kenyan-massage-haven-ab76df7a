
-- Create a view for booking analytics by date
CREATE OR REPLACE VIEW booking_analytics AS
SELECT 
    date_trunc('day', created_at) as date,
    COUNT(*) as total_bookings,
    SUM(total_amount) as total_revenue,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
    AVG(total_amount) as avg_booking_value,
    COUNT(DISTINCT phone) as unique_customers
FROM bookings 
GROUP BY date_trunc('day', created_at)
ORDER BY date DESC;

-- Create a view for monthly revenue trends
CREATE OR REPLACE VIEW monthly_revenue_trends AS
SELECT 
    date_trunc('month', created_at) as month,
    COUNT(*) as bookings_count,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_booking_value,
    COUNT(DISTINCT phone) as unique_customers
FROM bookings 
WHERE status != 'cancelled'
GROUP BY date_trunc('month', created_at)
ORDER BY month DESC;

-- Create a view for service duration analytics
CREATE OR REPLACE VIEW service_duration_analytics AS
SELECT 
    duration,
    COUNT(*) as booking_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_revenue_per_booking,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()), 2) as percentage
FROM bookings 
WHERE status != 'cancelled'
GROUP BY duration
ORDER BY booking_count DESC;

-- Create a view for branch performance
CREATE OR REPLACE VIEW branch_performance AS
SELECT 
    branch,
    COUNT(*) as total_bookings,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_booking_value,
    COUNT(DISTINCT phone) as unique_customers,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()), 2) as booking_percentage
FROM bookings 
WHERE status != 'cancelled'
GROUP BY branch
ORDER BY total_revenue DESC;

-- Create a view for daily performance metrics
CREATE OR REPLACE VIEW daily_performance AS
SELECT 
    date_trunc('day', created_at) as date,
    extract(dow from created_at) as day_of_week,
    COUNT(*) as booking_count,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_booking_value
FROM bookings 
WHERE status != 'cancelled'
AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date_trunc('day', created_at), extract(dow from created_at)
ORDER BY date DESC;

-- Function to get analytics summary for a date range
CREATE OR REPLACE FUNCTION get_analytics_summary(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_bookings BIGINT,
    total_revenue NUMERIC,
    avg_booking_value NUMERIC,
    unique_customers BIGINT,
    confirmed_bookings BIGINT,
    pending_bookings BIGINT,
    cancelled_bookings BIGINT,
    growth_rate NUMERIC
) 
LANGUAGE plpgsql
AS $$
DECLARE
    previous_period_start DATE;
    previous_period_end DATE;
    current_revenue NUMERIC;
    previous_revenue NUMERIC;
BEGIN
    -- Calculate previous period dates
    previous_period_end := start_date - INTERVAL '1 day';
    previous_period_start := previous_period_end - (end_date - start_date);
    
    -- Get current period metrics
    SELECT 
        COUNT(*),
        COALESCE(SUM(b.total_amount), 0),
        COALESCE(AVG(b.total_amount), 0),
        COUNT(DISTINCT b.phone),
        COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END),
        COUNT(CASE WHEN b.status = 'pending' THEN 1 END),
        COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END)
    INTO 
        total_bookings, current_revenue, avg_booking_value, 
        unique_customers, confirmed_bookings, pending_bookings, cancelled_bookings
    FROM bookings b
    WHERE b.created_at::date BETWEEN start_date AND end_date;
    
    total_revenue := current_revenue;
    
    -- Get previous period revenue for growth calculation
    SELECT COALESCE(SUM(b.total_amount), 0)
    INTO previous_revenue
    FROM bookings b
    WHERE b.created_at::date BETWEEN previous_period_start AND previous_period_end
    AND b.status != 'cancelled';
    
    -- Calculate growth rate
    IF previous_revenue > 0 THEN
        growth_rate := ROUND(((current_revenue - previous_revenue) / previous_revenue * 100), 2);
    ELSE
        growth_rate := 0;
    END IF;
    
    RETURN NEXT;
END;
$$;
