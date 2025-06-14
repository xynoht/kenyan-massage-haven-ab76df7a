
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { runHealthChecks, HealthReport, HealthCheck } from "@/utils/healthMonitor";
import HealthStatusCard from "./HealthStatusCard";
import DatabaseStats from "./DatabaseStats";
import IssuesList from "./IssuesList";
import RecommendationsList from "./RecommendationsList";

const SystemHealthDashboard = () => {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const healthReport = await runHealthChecks();
      setReport(healthReport);
      setLastCheck(new Date().toLocaleString());
      
      toast({
        title: "Health Check Complete",
        description: `System status: ${healthReport.overall}`,
        variant: healthReport.overall === 'error' ? 'destructive' : 'default'
      });
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Unable to complete system health check",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run health check on component mount
  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get database statistics from health checks
  const getDatabaseStats = () => {
    if (!report) return {};
    
    const bookingCheck = report.checks.find(c => c.name === 'Booking System');
    const contactCheck = report.checks.find(c => c.name === 'Contact System');
    const voucherCheck = report.checks.find(c => c.name === 'Voucher System');
    const adminCheck = report.checks.find(c => c.name === 'Admin System');

    return {
      bookings: bookingCheck?.details?.total || 0,
      contactMessages: contactCheck?.details?.total || 0,
      giftVouchers: voucherCheck?.details?.active || 0,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gold">System Health Dashboard</h2>
          <p className="text-gray-300 mt-2">
            Monitor your application's security and operational status
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
          {/* Overall Status */}
          <HealthStatusCard
            title="Overall System Status"
            status={report.overall}
            message={`System is ${report.overall}`}
            details={`${report.checks.length} components checked`}
          />

          {/* Database Statistics */}
          <DatabaseStats tables={getDatabaseStats()} />

          {/* Component Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-coral mb-3">Component Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.checks.map((check, index) => (
                <Card key={index} className="bg-gray-800 border-gold/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{check.name}</span>
                      {getStatusIcon(check.status)}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{check.message}</p>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                    {check.details && (
                      <div className="mt-2 text-xs text-gray-400">
                        {typeof check.details === 'object' ? (
                          Object.entries(check.details).map(([key, value]) => (
                            <div key={key}>{key}: {String(value)}</div>
                          ))
                        ) : (
                          <div>{String(check.details)}</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Issues */}
          <IssuesList issues={getIssues()} />

          {/* Recommendations */}
          <RecommendationsList recommendations={report.recommendations} />

          {/* Security Improvements Summary */}
          <Card className="bg-gray-800 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Recent Security Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-300">
                <p>✅ Row Level Security (RLS) enabled on all data tables</p>
                <p>✅ Access policies configured for bookings, messages, and vouchers</p>
                <p>✅ Database triggers added for automated data management</p>
                <p>✅ Booking notifications tracking system implemented</p>
                <p>✅ Comprehensive health monitoring system deployed</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!report && !isLoading && (
        <Card className="bg-gray-800 border-gold/20">
          <CardContent className="p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Health Data</h3>
            <p className="text-gray-300 mb-4">
              Click "Run Health Check" to analyze your system status
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemHealthDashboard;
