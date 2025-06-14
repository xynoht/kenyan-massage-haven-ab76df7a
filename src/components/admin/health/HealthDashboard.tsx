
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { healthMonitor, SystemHealthReport } from "@/utils/healthSystem";
import HealthOverview from "./HealthOverview";
import HealthChecksGrid from "./HealthChecksGrid";
import DatabaseStats from "./DatabaseStats";
import IssuesList from "./IssuesList";
import RecommendationsList from "./RecommendationsList";

const HealthDashboard = () => {
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const { toast } = useToast();

  const runHealthCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const healthReport = await healthMonitor.performComprehensiveHealthCheck();
      setReport(healthReport);
      setLastCheck(new Date().toLocaleString());
      
      const { errorCount, warningCount } = healthReport.metrics;
      
      if (errorCount > 0) {
        toast({
          title: "Health Check Complete",
          description: `Found ${errorCount} critical issues requiring attention.`,
          variant: "destructive",
        });
      } else if (warningCount > 0) {
        toast({
          title: "Health Check Complete",
          description: `Found ${warningCount} warnings to review.`,
        });
      } else {
        toast({
          title: "Health Check Complete",
          description: "All systems are healthy!",
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Unable to complete comprehensive health check.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Auto-run health check on component mount
  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  // Get database statistics from health checks
  const getDatabaseStats = () => {
    if (!report) return {};
    
    const dbChecks = report.checks.filter(c => c.category === 'database');
    const performanceCheck = report.checks.find(c => c.name === 'System Performance');
    const voucherCheck = report.checks.find(c => c.name === 'Voucher Data Integrity');
    const adminCheck = report.checks.find(c => c.name === 'Admin Security');

    return {
      bookings: performanceCheck?.details?.totalBookings || 0,
      contactMessages: 0, // This would need to be added to performance checks
      giftVouchers: voucherCheck?.details?.activeVouchers || 0,
      adminUsers: adminCheck?.details?.activeAdmins || 0
    };
  };

  // Get issues from health checks
  const getIssues = (): string[] => {
    if (!report) return [];
    
    return report.checks
      .filter(check => check.status === 'error' || check.status === 'warning')
      .map(check => `${check.name}: ${check.message}`);
  };

  if (!report && isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-300">
          <Activity className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Running comprehensive health check...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gold">System Health Dashboard</h2>
          <p className="text-gray-300 mt-2">
            Comprehensive monitoring of your application's health and performance
          </p>
        </div>
        <Button
          onClick={runHealthCheck}
          disabled={isLoading}
          className="bg-coral hover:bg-coral/90 text-black"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Run Health Check
        </Button>
      </div>

      {lastCheck && (
        <p className="text-sm text-gray-400">Last check: {lastCheck}</p>
      )}

      {report && (
        <>
          {/* Overview */}
          <HealthOverview report={report} />

          {/* Database Statistics */}
          <DatabaseStats tables={getDatabaseStats()} />

          {/* Health Checks Grid */}
          <HealthChecksGrid checks={report.checks} />

          {/* Issues */}
          <IssuesList issues={getIssues()} />

          {/* Recommendations */}
          <RecommendationsList recommendations={report.recommendations} />
        </>
      )}

      {!report && !isLoading && (
        <div className="text-center p-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Health Data</h3>
          <p className="text-gray-300 mb-4">
            Click "Run Health Check" to analyze your system status
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;
