
import { supabase } from "@/integrations/supabase/client";

export interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'checking';
  message: string;
  details?: any;
  lastChecked: string;
  category: 'database' | 'security' | 'performance' | 'system';
}

export interface SystemHealthReport {
  overall: 'healthy' | 'warning' | 'error';
  checks: HealthCheck[];
  timestamp: string;
  recommendations: string[];
  summary: string;
  metrics: {
    totalChecks: number;
    healthyCount: number;
    warningCount: number;
    errorCount: number;
  };
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  
  public static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  async performComprehensiveHealthCheck(): Promise<SystemHealthReport> {
    const checks: HealthCheck[] = [];
    const recommendations: string[] = [];
    const timestamp = new Date().toISOString();

    try {
      // Database connectivity checks
      await this.checkDatabaseConnectivity(checks);
      
      // Table structure and RLS checks
      await this.checkTableStructure(checks);
      
      // Performance checks
      await this.checkSystemPerformance(checks, recommendations);
      
      // Security checks
      await this.checkSecurityPolicies(checks, recommendations);
      
      // Data integrity checks
      await this.checkDataIntegrity(checks, recommendations);

    } catch (error) {
      checks.push({
        id: 'system-error',
        name: 'System Check',
        status: 'error',
        message: 'Critical system error during health check',
        details: error,
        lastChecked: timestamp,
        category: 'system'
      });
      recommendations.push('System requires immediate technical review');
    }

    return this.generateHealthReport(checks, recommendations, timestamp);
  }

  private async checkDatabaseConnectivity(checks: HealthCheck[]): Promise<void> {
    const timestamp = new Date().toISOString();
    
    try {
      const { error } = await supabase.from('bookings').select('id').limit(1);
      checks.push({
        id: 'db-connectivity',
        name: 'Database Connectivity',
        status: error ? 'error' : 'healthy',
        message: error ? 'Database connection failed' : 'Database connection successful',
        details: error?.message,
        lastChecked: timestamp,
        category: 'database'
      });
    } catch (error) {
      checks.push({
        id: 'db-connectivity',
        name: 'Database Connectivity',
        status: 'error',
        message: 'Failed to test database connectivity',
        details: error,
        lastChecked: timestamp,
        category: 'database'
      });
    }
  }

  private async checkTableStructure(checks: HealthCheck[]): Promise<void> {
    const timestamp = new Date().toISOString();
    const tables = ['bookings', 'contact_messages', 'gift_vouchers', 'admin_users', 'payment_transactions'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table as any).select('*').limit(1);
        checks.push({
          id: `table-${table}`,
          name: `${table} Table`,
          status: error ? 'warning' : 'healthy',
          message: error ? `Issues accessing ${table}` : `${table} table accessible`,
          details: error?.message,
          lastChecked: timestamp,
          category: 'database'
        });
      } catch (error) {
        checks.push({
          id: `table-${table}`,
          name: `${table} Table`,
          status: 'error',
          message: `Critical error with ${table} table`,
          details: error,
          lastChecked: timestamp,
          category: 'database'
        });
      }
    }
  }

  private async checkSystemPerformance(checks: HealthCheck[], recommendations: string[]): Promise<void> {
    const timestamp = new Date().toISOString();
    
    try {
      // Check recent activity performance
      const { data: recentBookings, error } = await supabase
        .from('bookings')
        .select('id, created_at, status')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        checks.push({
          id: 'performance-check',
          name: 'System Performance',
          status: 'error',
          message: 'Performance check failed',
          details: error.message,
          lastChecked: timestamp,
          category: 'performance'
        });
      } else {
        const bookingCount = recentBookings?.length || 0;
        const pendingCount = recentBookings?.filter(b => b.status === 'pending').length || 0;
        
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        let message = `${bookingCount} bookings in last 7 days`;
        
        if (pendingCount > 10) {
          status = 'warning';
          message += ` (${pendingCount} pending - review backlog)`;
          recommendations.push('High number of pending bookings detected - review processing workflow');
        }

        checks.push({
          id: 'performance-check',
          name: 'System Performance',
          status,
          message,
          details: { totalBookings: bookingCount, pendingBookings: pendingCount },
          lastChecked: timestamp,
          category: 'performance'
        });
      }
    } catch (error) {
      checks.push({
        id: 'performance-check',
        name: 'System Performance',
        status: 'error',
        message: 'Performance monitoring failed',
        details: error,
        lastChecked: timestamp,
        category: 'performance'
      });
    }
  }

  private async checkSecurityPolicies(checks: HealthCheck[], recommendations: string[]): Promise<void> {
    const timestamp = new Date().toISOString();
    
    try {
      // Check admin user security
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('id, is_active, last_login_at')
        .eq('is_active', true);

      if (error) {
        checks.push({
          id: 'security-admin',
          name: 'Admin Security',
          status: 'warning',
          message: 'Unable to verify admin security',
          details: error.message,
          lastChecked: timestamp,
          category: 'security'
        });
      } else {
        const activeAdmins = adminUsers?.length || 0;
        const recentlyActive = adminUsers?.filter(admin => 
          admin.last_login_at && new Date(admin.last_login_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length || 0;

        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        let message = `${activeAdmins} active admin users`;

        if (activeAdmins === 0) {
          status = 'error';
          message = 'No active admin users found';
          recommendations.push('Critical: Ensure admin access is properly configured');
        } else if (recentlyActive === 0) {
          status = 'warning';
          message += ' (no recent activity)';
          recommendations.push('No admin activity in 30 days - verify access is working');
        }

        checks.push({
          id: 'security-admin',
          name: 'Admin Security',
          status,
          message,
          details: { activeAdmins, recentlyActive },
          lastChecked: timestamp,
          category: 'security'
        });
      }
    } catch (error) {
      checks.push({
        id: 'security-admin',
        name: 'Admin Security',
        status: 'error',
        message: 'Security check failed',
        details: error,
        lastChecked: timestamp,
        category: 'security'
      });
    }
  }

  private async checkDataIntegrity(checks: HealthCheck[], recommendations: string[]): Promise<void> {
    const timestamp = new Date().toISOString();
    
    try {
      // Check voucher system integrity
      const { data: vouchers, error } = await supabase
        .from('gift_vouchers')
        .select('id, status, expires_at, amount')
        .eq('status', 'active');

      if (error) {
        checks.push({
          id: 'data-vouchers',
          name: 'Voucher Data Integrity',
          status: 'error',
          message: 'Voucher data check failed',
          details: error.message,
          lastChecked: timestamp,
          category: 'system'
        });
      } else {
        const activeVouchers = vouchers?.length || 0;
        const expiringSoon = vouchers?.filter(v => 
          new Date(v.expires_at) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length || 0;

        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        let message = `${activeVouchers} active vouchers`;

        if (expiringSoon > 0) {
          status = 'warning';
          message += ` (${expiringSoon} expiring soon)`;
          recommendations.push(`${expiringSoon} vouchers expire within 30 days - notify customers`);
        }

        checks.push({
          id: 'data-vouchers',
          name: 'Voucher Data Integrity',
          status,
          message,
          details: { activeVouchers, expiringSoon },
          lastChecked: timestamp,
          category: 'system'
        });
      }
    } catch (error) {
      checks.push({
        id: 'data-vouchers',
        name: 'Voucher Data Integrity',
        status: 'error',
        message: 'Data integrity check failed',
        details: error,
        lastChecked: timestamp,
        category: 'system'
      });
    }
  }

  private generateHealthReport(checks: HealthCheck[], recommendations: string[], timestamp: string): SystemHealthReport {
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const errorCount = checks.filter(c => c.status === 'error').length;
    
    let overall: 'healthy' | 'warning' | 'error' = 'healthy';
    if (errorCount > 0) {
      overall = 'error';
    } else if (warningCount > 0) {
      overall = 'warning';
    }

    // Generate intelligent summary
    let summary = `System Status: ${overall.toUpperCase()}. `;
    summary += `${checks.length} checks completed. `;
    if (errorCount > 0) {
      summary += `${errorCount} critical issues require immediate attention. `;
    }
    if (warningCount > 0) {
      summary += `${warningCount} warnings need review. `;
    }
    if (overall === 'healthy') {
      summary += 'All systems operational.';
    }

    // Add contextual recommendations
    if (overall === 'healthy' && recommendations.length === 0) {
      recommendations.push('System is running optimally - continue regular monitoring');
    } else if (overall === 'warning') {
      recommendations.push('Address warning items to maintain optimal performance');
    } else if (overall === 'error') {
      recommendations.push('Critical issues detected - immediate action required');
    }

    return {
      overall,
      checks,
      timestamp,
      recommendations,
      summary,
      metrics: {
        totalChecks: checks.length,
        healthyCount,
        warningCount,
        errorCount
      }
    };
  }
}

// Export singleton instance
export const healthMonitor = HealthMonitor.getInstance();

// Legacy compatibility exports
export const runHealthChecks = () => healthMonitor.performComprehensiveHealthCheck();
export const performSiteHealthCheck = () => healthMonitor.performComprehensiveHealthCheck();

// Type exports for compatibility
export type { SystemHealthReport as HealthReport, SystemHealthReport as SiteHealthReport };
