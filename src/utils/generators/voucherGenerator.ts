
export const generateTestVouchers = (count: number = 15) => {
  const senderNames = [
    'John Smith', 'Mary Johnson', 'Peter Wilson', 'Susan Davis', 'Mark Brown',
    'Linda Garcia', 'Paul Martinez', 'Nancy Anderson', 'Kevin Taylor', 'Karen White'
  ];

  const recipientNames = [
    'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson', 'Lisa Miller',
    'James Garcia', 'Jennifer Martinez', 'Robert Anderson', 'Maria Taylor', 'Christopher Lee'
  ];

  const branches = ['Westlands', 'Karen', 'Kilimani', 'Lavington'];
  const amounts = [2500, 4500, 6500, 8500, 10000];
  const statuses = ['active', 'redeemed', 'expired'];

  const messages = [
    "Happy Birthday! Enjoy a relaxing massage session.",
    "Congratulations on your promotion! You deserve some pampering.",
    "Wishing you a speedy recovery. Hope this helps you relax.",
    "Happy Anniversary! Treat yourself to some self-care.",
    "Merry Christmas! Enjoy this gift of relaxation.",
    "Thank you for everything you do. You're amazing!",
    "Get well soon! This should help you feel better.",
    "Happy Mother's Day! You deserve the best.",
    "Congratulations on your graduation! Celebrate in style.",
    "Just because you're wonderful! Enjoy your massage."
  ];

  const vouchers = [];

  for (let i = 0; i < count; i++) {
    const senderName = senderNames[Math.floor(Math.random() * senderNames.length)];
    const recipientName = recipientNames[Math.floor(Math.random() * recipientNames.length)];
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const voucher = {
      sender_name: senderName,
      recipient_name: recipientName,
      recipient_phone: `+254${Math.floor(Math.random() * 900000000) + 100000000}`,
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment_status: Math.random() < 0.8 ? 'completed' : 'pending',
      expires_at: expiresAt.toISOString()
    };

    vouchers.push(voucher);
  }

  return vouchers;
};
