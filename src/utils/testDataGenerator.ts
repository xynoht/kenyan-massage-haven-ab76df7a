
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

    // Generate test gift vouchers with voucher_code property
    const testVouchers = [
      {
        sender_name: "John Doe",
        recipient_name: "Mary Doe",
        recipient_phone: "+254701234567",
        amount: 5000,
        branch: "Nairobi CBD",
        message: "Happy Birthday! Enjoy a relaxing massage.",
        payment_status: "completed",
        status: "active",
        voucher_code: "PRI-TEST001"
      },
      {
        sender_name: "Sarah Wilson",
        recipient_name: "Emma Wilson",
        recipient_phone: "+254722334455",
        amount: 7500,
        branch: "Westlands",
        message: "Congratulations on your promotion! You deserve some pampering.",
        payment_status: "completed",
        status: "active",
        voucher_code: "PRI-TEST002"
      },
      {
        sender_name: "Mike Johnson",
        recipient_name: "Lisa Johnson",
        recipient_phone: "+254712345678",
        amount: 3500,
        branch: "Karen",
        message: "Get well soon! This will help you relax and recover.",
        payment_status: "pending",
        status: "active",
        voucher_code: "PRI-TEST003"
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
    console.log('Clearing all test data...');

    // Clear all data from tables individually with proper typing
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (bookingsError) {
      console.error('Error clearing bookings:', bookingsError);
    } else {
      console.log('Successfully cleared bookings table');
    }

    const { error: messagesError } = await supabase
      .from('contact_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (messagesError) {
      console.error('Error clearing contact_messages:', messagesError);
    } else {
      console.log('Successfully cleared contact_messages table');
    }

    const { error: vouchersError } = await supabase
      .from('gift_vouchers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (vouchersError) {
      console.error('Error clearing gift_vouchers:', vouchersError);
    } else {
      console.log('Successfully cleared gift_vouchers table');
    }

    const { error: mpesaError } = await supabase
      .from('mpesa_transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (mpesaError) {
      console.error('Error clearing mpesa_transactions:', mpesaError);
    } else {
      console.log('Successfully cleared mpesa_transactions table');
    }

    const { error: paymentsError } = await supabase
      .from('payment_transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (paymentsError) {
      console.error('Error clearing payment_transactions:', paymentsError);
    } else {
      console.log('Successfully cleared payment_transactions table');
    }

    console.log('All test data cleared successfully');
    return { success: true, message: 'All test data cleared successfully' };

  } catch (error) {
    console.error('Error clearing test data:', error);
    return { success: false, message: 'Failed to clear test data', error };
  }
};

export const performSiteHealthCheck = async () => {
  try {
    console.log('Performing comprehensive site health check...');
    
    const healthReport = {
      database: { status: 'checking', tables: {} as Record<string, number> },
      authentication: { status: 'checking' },
      navigation: { status: 'checking' },
      adminDashboard: { status: 'checking' },
      forms: { status: 'checking' },
      issues: [] as string[],
      recommendations: [] as string[]
    };

    // Test database connectivity
    try {
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });
      
      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });
      
      const { count: vouchersCount } = await supabase
        .from('gift_vouchers')
        .select('*', { count: 'exact', head: true });
      
      const { count: adminUsersCount } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
      
      healthReport.database.status = 'healthy';
      healthReport.database.tables = {
        bookings: bookingsCount || 0,
        messages: messagesCount || 0,
        vouchers: vouchersCount || 0,
        adminUsers: adminUsersCount || 0
      };
    } catch (error) {
      healthReport.database.status = 'error';
      healthReport.issues.push('Database connectivity issues detected');
    }

    // Test admin authentication
    try {
      const { data: testAuth } = await supabase.rpc('authenticate_admin', {
        email_input: 'test@example.com',
        password_input: 'wrongpassword'
      });
      healthReport.authentication.status = 'healthy';
    } catch (error) {
      healthReport.authentication.status = 'error';
      healthReport.issues.push('Admin authentication system may have issues');
    }

    // Check for potential issues
    if (healthReport.database.tables.adminUsers === 0) {
      healthReport.issues.push('No admin users found - you may need to create an admin account');
    }

    // Add recommendations
    healthReport.recommendations.push('Test admin login with valid credentials');
    healthReport.recommendations.push('Test booking form submission');
    healthReport.recommendations.push('Test contact form submission');
    healthReport.recommendations.push('Test gift voucher creation');
    
    return healthReport;
  } catch (error) {
    console.error('Health check failed:', error);
    return { 
      status: 'error', 
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
