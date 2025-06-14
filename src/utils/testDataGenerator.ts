
import { supabase } from "@/integrations/supabase/client";
import { generateTestBookings } from "./generators/bookingGenerator";
import { generateTestMessages } from "./generators/messageGenerator";
import { generateTestVouchers } from "./generators/voucherGenerator";

export { performSiteHealthCheck } from "./generators/healthChecker";

export const generateAllTestData = async () => {
  console.log('Starting test data generation...');
  
  try {
    // Generate test data
    const bookings = generateTestBookings(50);
    const messages = generateTestMessages(20);
    const vouchers = generateTestVouchers(15);

    // Insert test data
    console.log('Inserting test bookings...');
    const { error: bookingsError } = await supabase
      .from('bookings')
      .insert(bookings);

    if (bookingsError) {
      console.error('Error inserting bookings:', bookingsError);
      throw bookingsError;
    }

    console.log('Inserting test messages...');
    const { error: messagesError } = await supabase
      .from('contact_messages')
      .insert(messages);

    if (messagesError) {
      console.error('Error inserting messages:', messagesError);
      throw messagesError;
    }

    console.log('Inserting test vouchers...');
    const { error: vouchersError } = await supabase
      .from('gift_vouchers')
      .insert(vouchers);

    if (vouchersError) {
      console.error('Error inserting vouchers:', vouchersError);
      throw vouchersError;
    }

    // Add some analytics data
    console.log('Inserting analytics data...');
    const analyticsData = [
      { metric_name: 'total_bookings', metric_value: bookings.length },
      { metric_name: 'total_revenue', metric_value: bookings.reduce((sum, b) => sum + b.total_amount, 0) },
      { metric_name: 'active_vouchers', metric_value: vouchers.filter(v => v.status === 'active').length }
    ];

    const { error: analyticsError } = await supabase
      .from('admin_analytics')
      .insert(analyticsData);

    if (analyticsError) {
      console.error('Error inserting analytics:', analyticsError);
      // Don't throw here as analytics is not critical
    }

    console.log('Test data generation completed successfully!');
    return {
      success: true,
      bookings: bookings.length,
      messages: messages.length,
      vouchers: vouchers.length
    };

  } catch (error) {
    console.error('Test data generation failed:', error);
    throw error;
  }
};

export const clearAllTestData = async () => {
  console.log('Clearing all test data...');
  
  try {
    // Clear in reverse dependency order
    await supabase.from('admin_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('payment_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('mpesa_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('gift_vouchers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('contact_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('All test data cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error clearing test data:', error);
    throw error;
  }
};
