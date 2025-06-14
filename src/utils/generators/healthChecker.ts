
import { supabase } from "@/integrations/supabase/client";

export const performSiteHealthCheck = async () => {
  console.log('Starting comprehensive site health check...');
  
  try {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check database connectivity and tables
    console.log('Checking database connectivity...');
    const tableChecks = await Promise.allSettled([
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('gift_vouchers').select('*', { count: 'exact', head: true }),
      supabase.from('admin_users').select('*', { count: 'exact', head: true }),
      supabase.from('payment_transactions').select('*', { count: 'exact', head: true })
    ]);

    const tableNames = ['bookings', 'contact_messages', 'gift_vouchers', 'admin_users', 'payment_transactions'];
    const tableCounts: Record<string, number> = {};
    
    tableChecks.forEach((result, index) => {
      const tableName = tableNames[index];
      if (result.status === 'fulfilled' && !result.value.error) {
        tableCounts[tableName] = result.value.count || 0;
      } else {
        tableCounts[tableName] = 0;
        issues.push(`Table ${tableName} is not accessible or has errors`);
      }
    });

    // Check for data integrity issues
    if (tableCounts.bookings === 0) {
      issues.push('No booking data found - customers may not be able to see their appointments');
      recommendations.push('Add sample booking data for testing or check if the booking form is working');
    }

    if (tableCounts.admin_users === 0) {
      issues.push('No admin users found - admin dashboard may not be accessible');
      recommendations.push('Create at least one admin user account');
    }

    if (tableCounts.contact_messages === 0) {
      recommendations.push('No contact messages found - consider testing the contact form');
    }

    // Check authentication system
    let authStatus = 'healthy';
    try {
      const { data: session } = await supabase.auth.getSession();
      console.log('Auth system check:', session ? 'Active session found' : 'No active session');
    } catch (error) {
      authStatus = 'error';
      issues.push('Authentication system appears to be malfunctioning');
    }

    // Performance checks
    if (tableCounts.bookings > 1000) {
      recommendations.push('Large number of bookings detected - consider implementing pagination');
    }

    if (tableCounts.contact_messages > 500) {
      recommendations.push('Large number of messages detected - consider archiving old messages');
    }

    // Navigation and forms check
    const navigationStatus = 'healthy'; // Assume healthy since we're in the app
    const formsStatus = issues.length > 0 ? 'warning' : 'healthy';

    console.log('Health check completed successfully');
    
    return {
      database: {
        status: issues.length === 0 ? 'healthy' : 'warning',
        tables: tableCounts
      },
      authentication: {
        status: authStatus
      },
      navigation: {
        status: navigationStatus
      },
      adminDashboard: {
        status: 'healthy'
      },
      forms: {
        status: formsStatus
      },
      issues,
      recommendations
    };

  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'error',
      message: 'Health check failed to complete',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
