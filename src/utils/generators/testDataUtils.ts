
import { supabase } from "@/integrations/supabase/client";

export const generateAllTestData = async () => {
  try {
    console.log('Starting test data generation...');
    
    // Generate sample bookings
    const sampleBookings = [
      {
        name: 'John Doe',
        phone: '+254712345678',
        email: 'john.doe@example.com',
        date: '2025-02-20',
        time: '10:00:00',
        duration: 60,
        branch: 'Westlands',
        total_amount: 3000,
        status: 'confirmed',
        notes: 'First time customer'
      },
      {
        name: 'Jane Smith',
        phone: '+254798765432',
        email: 'jane.smith@example.com',
        date: '2025-02-21',
        time: '14:30:00',
        duration: 90,
        branch: 'Karen',
        total_amount: 4500,
        status: 'pending',
        notes: 'Prefers quiet environment'
      },
      {
        name: 'Mike Johnson',
        phone: '+254722334455',
        email: 'mike.j@example.com',
        date: '2025-02-22',
        time: '11:00:00',
        duration: 120,
        branch: 'Westlands',
        total_amount: 6000,
        status: 'confirmed',
        notes: 'Regular customer'
      },
      {
        name: 'Sarah Wilson',
        phone: '+254733445566',
        date: '2025-02-23',
        time: '15:00:00',
        duration: 60,
        branch: 'Karen',
        total_amount: 3000,
        status: 'cancelled',
        notes: 'Cancelled due to emergency'
      },
      {
        name: 'David Brown',
        phone: '+254744556677',
        email: 'david.brown@example.com',
        date: '2025-02-24',
        time: '09:30:00',
        duration: 90,
        branch: 'Westlands',
        total_amount: 4500,
        status: 'pending',
        notes: 'Corporate booking'
      }
    ];

    // Generate sample contact messages
    const sampleMessages = [
      {
        name: 'Alice Cooper',
        phone: '+254755667788',
        message: 'Hi, I would like to know more about your couples massage packages. Do you offer any special rates?',
        status: 'new'
      },
      {
        name: 'Robert Taylor',
        phone: '+254766778899',
        message: 'I had a massage last week and it was amazing! Can I book the same therapist again?',
        status: 'read'
      },
      {
        name: 'Emma Davis',
        phone: '+254777889900',
        message: 'What are your operating hours during weekends? I work during the week and can only come on Saturday.',
        status: 'new'
      },
      {
        name: 'Chris Martin',
        phone: '+254788990011',
        message: 'Do you have parking available at your Karen branch? I will be driving there.',
        status: 'replied'
      }
    ];

    // Generate sample gift vouchers with voucher_code field
    const sampleVouchers = [
      {
        sender_name: 'Lisa Anderson',
        recipient_name: 'Mary Anderson',
        recipient_phone: '+254799001122',
        amount: 5000,
        branch: 'Westlands',
        message: 'Happy Birthday! Enjoy a relaxing massage.',
        payment_status: 'completed',
        status: 'active',
        voucher_code: 'PRI-TEST001'
      },
      {
        sender_name: 'Tom Wilson',
        recipient_name: 'Helen Wilson',
        recipient_phone: '+254700112233',
        amount: 7500,
        branch: 'Karen',
        message: 'Anniversary gift for my lovely wife.',
        payment_status: 'completed',
        status: 'active',
        voucher_code: 'PRI-TEST002'
      },
      {
        sender_name: 'Peter Jones',
        recipient_name: 'Susan Jones',
        recipient_phone: '+254711223344',
        amount: 3000,
        branch: 'Westlands',
        message: 'Get well soon! This should help you relax.',
        payment_status: 'pending',
        status: 'active',
        voucher_code: 'PRI-TEST003'
      }
    ];

    // Insert sample data
    const { error: bookingsError } = await supabase
      .from('bookings')
      .insert(sampleBookings);

    if (bookingsError) {
      console.error('Error inserting bookings:', bookingsError);
      throw bookingsError;
    }

    const { error: messagesError } = await supabase
      .from('contact_messages')
      .insert(sampleMessages);

    if (messagesError) {
      console.error('Error inserting messages:', messagesError);
      throw messagesError;
    }

    const { error: vouchersError } = await supabase
      .from('gift_vouchers')
      .insert(sampleVouchers);

    if (vouchersError) {
      console.error('Error inserting vouchers:', vouchersError);
      throw vouchersError;
    }

    console.log('Test data generation completed successfully');
    return { success: true };

  } catch (error) {
    console.error('Test data generation failed:', error);
    return { success: false, error };
  }
};

export const clearAllTestData = async () => {
  try {
    console.log('Starting test data cleanup...');
    
    // Clear all test data (be careful - this removes ALL data)
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except non-existent ID

    if (bookingsError) {
      console.error('Error clearing bookings:', bookingsError);
      throw bookingsError;
    }

    const { error: messagesError } = await supabase
      .from('contact_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (messagesError) {
      console.error('Error clearing messages:', messagesError);
      throw messagesError;
    }

    const { error: vouchersError } = await supabase
      .from('gift_vouchers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (vouchersError) {
      console.error('Error clearing vouchers:', vouchersError);
      throw vouchersError;
    }

    console.log('Test data cleanup completed successfully');
    return { success: true };

  } catch (error) {
    console.error('Test data cleanup failed:', error);
    return { success: false, error };
  }
};
