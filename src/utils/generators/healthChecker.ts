
import { supabase } from "@/integrations/supabase/client";

export interface SiteHealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
  lastChecked: string;
}

export interface SiteHealthReport {
  overall: 'healthy' | 'warning' | 'error';
  checks: SiteHealthCheck[];
  timestamp: string;
  recommendations: string[];
  summary: string;
}

export const performSiteHealthCheck = async (): Promise<SiteHealthReport> => {
  const checks: SiteHealthCheck[] = [];
  const recommendations: string[] = [];
  const timestamp = new Date().toISOString();

  try {
    // Database connectivity check
    const { error: dbError } = await supabase.from('bookings').select('id').limit(1);
    checks.push({
      id: 'db-connectivity',
      name: 'Database Connectivity',
      status: dbError ? 'error' : 'healthy',
      message: dbError ? 'Database connection failed' : 'Database connection successful',
      details: dbError?.message,
      lastChecked: timestamp
    });

    if (dbError) {
      recommendations.push('Check database connection and credentials');
    }

    // Table structure checks
    const tables = ['bookings', 'contact_messages', 'gift_vouchers', 'admin_users'];
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table as any).select('*').limit(1);
        checks.push({
          id: `table-${table}`,
          name: `${table} Table`,
          status: error ? 'warning' : 'healthy',
          message: error ? `Issues with ${table} table` : `${table} table accessible`,
          details: error?.message,
          lastChecked: timestamp
        });

        if (error) {
          recommendations.push(`Review ${table} table structure and permissions`);
        }
      } catch (e) {
        checks.push({
          id: `table-${table}`,
          name: `${table} Table`,
          status: 'error',
          message: `Failed to check ${table} table`,
          details: e,
          lastChecked: timestamp
        });
      }
    }

    // Check recent activity
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select('id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    checks.push({
      id: 'recent-activity',
      name: 'Recent Activity',
      status: 'healthy',
      message: `${recentBookings?.length || 0} bookings in last 7 days`,
      details: { bookingCount: recentBookings?.length || 0 },
      lastChecked: timestamp
    });

  } catch (error) {
    checks.push({
      id: 'general-error',
      name: 'General System Check',
      status: 'error',
      message: 'System health check failed',
      details: error,
      lastChecked: timestamp
    });
    recommendations.push('System requires immediate attention');
  }

  // Determine overall status
  const errorCount = checks.filter(c => c.status === 'error').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  
  let overall: 'healthy' | 'warning' | 'error' = 'healthy';
  if (errorCount > 0) {
    overall = 'error';
  } else if (warningCount > 0) {
    overall = 'warning';
  }

  // Generate summary
  let summary = `System Status: ${overall.toUpperCase()}. `;
  summary += `${checks.length} checks completed. `;
  if (errorCount > 0) {
    summary += `${errorCount} critical issues found. `;
  }
  if (warningCount > 0) {
    summary += `${warningCount} warnings detected. `;
  }
  if (overall === 'healthy') {
    summary += 'All systems operational.';
  }

  // Add general recommendations
  if (overall === 'healthy') {
    recommendations.push('System is running optimally');
  } else if (overall === 'warning') {
    recommendations.push('Monitor warnings to prevent issues');
  } else {
    recommendations.push('Address critical issues immediately');
  }

  return {
    overall,
    checks,
    timestamp,
    recommendations,
    summary
  };
};

export const generateHealthSummary = (report: SiteHealthReport): string => {
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
