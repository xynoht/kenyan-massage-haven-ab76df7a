
export const generateTestBookings = (count: number = 50) => {
  const names = [
    'Sarah Johnson', 'Michael Chen', 'Emma Wilson', 'David Rodriguez', 'Lisa Thompson',
    'James Anderson', 'Maria Garcia', 'Robert Kim', 'Jennifer Lee', 'Christopher Taylor'
  ];
  
  const branches = ['Westlands', 'Karen', 'Kilimani', 'Lavington'];
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const services = [
    { duration: 30, amount: 2500 },
    { duration: 60, amount: 4500 },
    { duration: 90, amount: 6500 },
    { duration: 120, amount: 8500 }
  ];

  const bookings = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  for (let i = 0; i < count; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
    const service = services[Math.floor(Math.random() * services.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    
    const booking = {
      name,
      phone: `+254${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      date: randomDate.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 8}:${Math.random() < 0.5 ? '00' : '30'}`,
      duration: service.duration,
      total_amount: service.amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      notes: Math.random() < 0.3 ? 'Special request: Please use lavender oil' : null
    };

    bookings.push(booking);
  }

  return bookings;
};
