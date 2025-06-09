
import { supabase } from "@/integrations/supabase/client";

export const generateTestData = async () => {
  try {
    console.log('Starting test data generation...');

    // Generate test bookings
    const testBookings = [
      {
        name: "John Doe",
        phone: "+254701234567",
        email: "john.doe@example.com",
        date: "2024-12-15",
        time: "14:00",
        duration: 60,
        total_amount: 3500,
        status: "confirmed",
        branch: "Nairobi CBD",
        notes: "First time customer, prefers medium pressure"
      },
      {
        name: "Jane Smith",
        phone: "+254707654321",
        email: "jane.smith@example.com",
        date: "2024-12-16",
        time: "10:30",
        duration: 90,
        total_amount: 5000,
        status: "pending",
        branch: "Westlands",
        notes: "Regular customer, allergic to lavender oil"
      },
      {
        name: "Mike Johnson",
        phone: "+254712345678",
        email: "mike.johnson@example.com",
        date: "2024-12-14",
        time: "16:15",
        duration: 120,
        total_amount: 7500,
        status: "completed",
        branch: "Karen",
        notes: "Couple's massage session"
      },
      {
        name: "Sarah Wilson",
        phone: "+254722334455",
        email: "sarah.wilson@example.com",
        date: "2024-12-17",
        time: "09:00",
        duration: 60,
        total_amount: 3500,
        status: "cancelled",
        branch: "Nairobi CBD",
        notes: "Had to cancel due to emergency"
      },
      {
        name: "David Brown",
        phone: "+254733445566",
        email: "david.brown@example.com",
        date: "2024-12-18",
        time: "13:30",
        duration: 90,
        total_amount: 5000,
        status: "pending",
        branch: "Westlands",
        notes: "Sports massage for marathon training"
      }
    ];

    // Insert test bookings
    const { error: bookingsError } = await supabase
      .from('bookings')
      .insert(testBookings);

    if (bookingsError) {
      console.error('Error inserting bookings:', bookingsError);
    } else {
      console.log('Test bookings inserted successfully');
    }

    // Generate test contact messages
    const testMessages = [
      {
        name: "John Doe",
        phone: "+254701234567",
        message: "Hi, I'd like to know more about your deep tissue massage services. What's the pricing?",
        status: "new"
      },
      {
        name: "Alice Cooper",
        phone: "+254708765432",
        message: "I had a wonderful experience at your Karen branch last week. Thank you!",
        status: "replied"
      },
      {
        name: "Bob Johnson",
        phone: "+254719876543",
        message: "Do you offer home massage services? I'm unable to travel to your location.",
        status: "new"
      },
      {
        name: "Emma Davis",
        phone: "+254729384756",
        message: "I'm interested in booking a couples massage for my anniversary. What packages do you have?",
        status: "new"
      }
    ];

    // Insert test messages
    const { error: messagesError } = await supabase
      .from('contact_messages')
      .insert(testMessages);

    if (messagesError) {
      console.error('Error inserting messages:', messagesError);
    } else {
      console.log('Test messages inserted successfully');
    }

    // Generate test gift vouchers
    const testVouchers = [
      {
        sender_name: "John Doe",
        recipient_name: "Mary Doe",
        recipient_phone: "+254701234567",
        amount: 5000,
        branch: "Nairobi CBD",
        message: "Happy Birthday! Enjoy a relaxing massage.",
        payment_status: "completed",
        status: "active"
      },
      {
        sender_name: "Sarah Wilson",
        recipient_name: "Emma Wilson",
        recipient_phone: "+254722334455",
        amount: 7500,
        branch: "Westlands",
        message: "Congratulations on your promotion! You deserve some pampering.",
        payment_status: "completed",
        status: "active"
      },
      {
        sender_name: "Mike Johnson",
        recipient_name: "Lisa Johnson",
        recipient_phone: "+254712345678",
        amount: 3500,
        branch: "Karen",
        message: "Get well soon! This will help you relax and recover.",
        payment_status: "pending",
        status: "active"
      }
    ];

    // Insert test vouchers
    const { error: vouchersError } = await supabase
      .from('gift_vouchers')
      .insert(testVouchers);

    if (vouchersError) {
      console.error('Error inserting vouchers:', vouchersError);
    } else {
      console.log('Test vouchers inserted successfully');
    }

    console.log('All test data generated successfully!');
    return { success: true, message: 'Test data generated successfully' };

  } catch (error) {
    console.error('Error generating test data:', error);
    return { success: false, message: 'Failed to generate test data', error };
  }
};

export const clearTestData = async () => {
  try {
    console.log('Clearing test data...');

    // Clear test data (be careful in production!)
    await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('contact_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('gift_vouchers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Test data cleared successfully');
    return { success: true, message: 'Test data cleared successfully' };

  } catch (error) {
    console.error('Error clearing test data:', error);
    return { success: false, message: 'Failed to clear test data', error };
  }
};
