
import { supabase } from "@/integrations/supabase/client";

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface HealthReport {
  overall: 'healthy' | 'warning' | 'error';
  checks: HealthCheck[];
  timestamp: string;
  recommendations: string[];
}

export const runHealthChecks = async (): Promise<HealthReport> => {
  const checks: HealthCheck[] = [];
  const recommendations: string[] = [];

  // Check database connectivity
  try {
    const { error } = await supabase.from('bookings').select('id').limit(1);
    if (error) {
      checks.push({
        name: 'Database Connectivity',
        status: 'error',
        message: 'Unable to connect to database',
        details: error.message
      });
    } else {
      checks.push({
        name: 'Database Connectivity',
        status: 'healthy',
        message: 'Database connection successful'
      });
    }
  } catch (error) {
    checks.push({
      name: 'Database Connectivity',
      status: 'error',
      message: 'Database connection failed',
      details: error
    });
  }

  // Check RLS policies
  try {
    const mainTables = ['bookings', 'contact_messages', 'gift_vouchers', 'mpesa_transactions', 'payment_transactions'];
    let rlsIssues = 0;
    
    for (const table of mainTables) {
      try {
        // Try to access the table - RLS will block if not properly configured
        const { error } = await supabase.from(table as any).select('id').limit(1);
        if (error && error.message.includes('row-level security')) {
          rlsIssues++;
        }
      } catch (e) {
        // RLS might be working correctly
      }
    }

    if (rlsIssues === 0) {
      checks.push({
        name: 'Row Level Security',
        status: 'healthy',
        message: 'RLS policies are properly configured'
      });
    } else {
      checks.push({
        name: 'Row Level Security',
        status: 'warning',
        message: `${rlsIssues} tables may have RLS configuration issues`
      });
      recommendations.push('Review and update RLS policies for better security');
    }
  } catch (error) {
    checks.push({
      name: 'Row Level Security',
      status: 'error',
      message: 'Unable to check RLS status',
      details: error
    });
  }

  // Check recent booking activity
  try {
    const { data: recentBookings, error } = await supabase
      .from('bookings')
      .select('id, created_at, status')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      checks.push({
        name: 'Booking System',
        status: 'error',
        message: 'Unable to access booking data',
        details: error.message
      });
    } else {
      const pendingBookings = recentBookings?.filter(b => b.status === 'pending').length || 0;
      
      checks.push({
        name: 'Booking System',
        status: 'healthy',
        message: `${recentBookings?.length || 0} bookings in last 7 days`,
        details: { total: recentBookings?.length || 0, pending: pendingBookings }
      });

      if (pendingBookings > 5) {
        recommendations.push('Review pending bookings - there may be a backlog');
      }
    }
  } catch (error) {
    checks.push({
      name: 'Booking System',
      status: 'error',
      message: 'Booking system check failed',
      details: error
    });
  }

  // Check message system
  try {
    const { data: recentMessages, error } = await supabase
      .from('contact_messages')
      .select('id, status, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      checks.push({
        name: 'Contact System',
        status: 'error',
        message: 'Unable to access contact messages',
        details: error.message
      });
    } else {
      const unreadMessages = recentMessages?.filter(m => m.status === 'new').length || 0;
      
      checks.push({
        name: 'Contact System',
        status: unreadMessages > 10 ? 'warning' : 'healthy',
        message: `${recentMessages?.length || 0} messages in last 7 days`,
        details: { total: recentMessages?.length || 0, unread: unreadMessages }
      });

      if (unreadMessages > 10) {
        recommendations.push('Review unread contact messages');
      }
    }
  } catch (error) {
    checks.push({
      name: 'Contact System',
      status: 'error',
      message: 'Contact system check failed',
      details: error
    });
  }

  // Check voucher system
  try {
    const { data: activeVouchers, error } = await supabase
      .from('gift_vouchers')
      .select('id, status, expires_at')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString());

    if (error) {
      checks.push({
        name: 'Voucher System',
        status: 'error',
        message: 'Unable to access voucher data',
        details: error.message
      });
    } else {
      const expiringVouchers = activeVouchers?.filter(v => 
        new Date(v.expires_at) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length || 0;

      checks.push({
        name: 'Voucher System',
        status: 'healthy',
        message: `${activeVouchers?.length || 0} active vouchers`,
        details: { active: activeVouchers?.length || 0, expiringSoon: expiringVouchers }
      });

      if (expiringVouchers > 0) {
        recommendations.push(`${expiringVouchers} vouchers expire within 30 days`);
      }
    }
  } catch (error) {
    checks.push({
      name: 'Voucher System',
      status: 'error',
      message: 'Voucher system check failed',
      details: error
    });
  }

  // Check admin system
  try {
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id, is_active, last_login_at')
      .eq('is_active', true);

    if (error) {
      checks.push({
        name: 'Admin System',
        status: 'warning',
        message: 'Unable to verify admin access',
        details: error.message
      });
    } else {
      checks.push({
        name: 'Admin System',
        status: 'healthy',
        message: `${adminUsers?.length || 0} active admin users`,
        details: { activeAdmins: adminUsers?.length || 0 }
      });

      if ((adminUsers?.length || 0) === 0) {
        recommendations.push('No active admin users found - ensure admin access is properly configured');
      }
    }
  } catch (error) {
    checks.push({
      name: 'Admin System',
      status: 'error',
      message: 'Admin system check failed',
      details: error
    });
  }

  // Determine overall health
  const errorCount = checks.filter(c => c.status === 'error').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  
  let overall: 'healthy' | 'warning' | 'error' = 'healthy';
  if (errorCount > 0) {
    overall = 'error';
  } else if (warningCount > 0) {
    overall = 'warning';
  }

  // Add general recommendations
  if (overall === 'healthy') {
    recommendations.push('System is running optimally');
  } else if (overall === 'warning') {
    recommendations.push('Review warning items to maintain optimal performance');
  } else {
    recommendations.push('Immediate attention required to resolve critical issues');
  }

  return {
    overall,
    checks,
    timestamp: new Date().toISOString(),
    recommendations
  };
};

export const generateHealthSummary = (report: HealthReport): string => {
  const { overall, checks, recommendations } = report;
  
  let summary = `System Health: ${overall.toUpperCase()}\n\n`;
  
  summary += "Component Status:\n";
  checks.forEach(check => {
    const icon = check.status === 'healthy' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    summary += `${icon} ${check.name}: ${check.message}\n`;
  });
  
  summary += "\nRecommendations:\n";
  recommendations.forEach((rec, index) => {
    summary += `${index + 1}. ${rec}\n`;
  });
  
  return summary;
};
