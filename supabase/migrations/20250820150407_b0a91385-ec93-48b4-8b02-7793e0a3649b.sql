-- Test inserting a booking to check RLS policies
INSERT INTO bookings (
    name,
    phone,
    email,
    date,
    time,
    duration,
    branch,
    notes,
    total_amount,
    status
) VALUES (
    'Test User',
    '254700000000',
    'test@example.com',
    '2024-12-25',
    '10:00',
    60,
    'Nairobi CBD',
    'Test booking',
    3000,
    'pending'
);

-- Check if the insert worked
SELECT * FROM bookings WHERE name = 'Test User';