
export const generateTestMessages = (count: number = 20) => {
  const names = [
    'Alice Williams', 'Bob Johnson', 'Carol Davis', 'Daniel Brown', 'Eva Martinez',
    'Frank Wilson', 'Grace Taylor', 'Henry Anderson', 'Iris Garcia', 'Jack Miller'
  ];

  const messageTemplates = [
    "Hello, I'd like to book a massage appointment. What are your available times?",
    "Do you offer couples massage packages? I'm interested in booking for this weekend.",
    "What types of massage oils do you use? I have sensitive skin.",
    "Can I reschedule my appointment from tomorrow to next week?",
    "I'm looking for a deep tissue massage. Do you have availability this week?",
    "What are your prices for a 90-minute Swedish massage?",
    "Do you offer mobile massage services? I'd prefer treatment at home.",
    "I'd like to purchase a gift voucher for my mother. How can I do this?",
    "What safety measures do you have in place for COVID-19?",
    "Can you accommodate pregnant women? I'm in my second trimester."
  ];

  const messages = [];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const message = {
      name,
      phone: `+254${Math.floor(Math.random() * 900000000) + 100000000}`,
      message: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
      status: Math.random() < 0.7 ? 'new' : 'read'
    };

    messages.push(message);
  }

  return messages;
};
