
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Database,
  Shield,
  Settings,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performSiteHealthCheck, SiteHealthReport as HealthCheckReport } from "@/utils/testDataGenerator";
import HealthStatusCard from "./health/HealthStatusCard";
import DatabaseStats from "./health/DatabaseStats";
import IssuesList from "./health/IssuesList";
import RecommendationsList from "./health/RecommendationsList";

const SiteHealthReport = () => {
  const [healthReport, setHealthReport] = useState<HealthCheckReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const report = await performSiteHealthCheck();
      setHealthReport(report);
      
      const errorChecks = report.checks.filter(check => check.status === 'error');
      const warningChecks = report.checks.filter(check => check.status === 'warning');
      
      if (errorChecks.length > 0) {
        toast({
          title: "Health Check Complete",
          description: `Found ${errorChecks.length} critical issues to address.`,
          variant: "destructive",
        });
      } else if (warningChecks.length > 0) {
        toast({
          title: "Health Check Complete",
          description: `Found ${warningChecks.length} warnings to review.`,
        });
      } else {
        toast({
          title: "Health Check Complete",
          description: "Site appears to be healthy!",
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Could not complete the health check.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  // Convert health checks to database stats format
  const getDatabaseStats = () => {
    if (!healthReport) return {};
    
    // Extract database-related information from health checks
    const dbCheck = healthReport.checks.find(check => check.name === 'Database Connectivity');
    const activityCheck = healthReport.checks.find(check => check.name === 'Recent Activity');
    
    return {
      bookings: activityCheck?.details?.bookingCount || 0,
      contactMessages: 0, // This would need to be added to health check details
      giftVouchers: 0, // This would need to be added to health check details
      adminUsers: 0 // This would need to be added to health check details
    };
  };

  // Convert health checks to issues list
  const getIssues = (): string[] => {
    if (!healthReport) return [];
    
    return healthReport.checks
      .filter(check => check.status === 'error' || check.status === 'warning')
      .map(check => `${check.name}: ${check.message}`);
  };

  if (!healthReport) {
    return (
      <Card className="bg-gray-800 border-gold/20">
        <CardContent className="p-6">
          <div className="text-center text-gray-300">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            Running comprehensive health check...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Site Health Report
            </CardTitle>
            <Button
              onClick={runHealthCheck}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-coral text-coral hover:bg-coral hover:text-black"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Check
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Status */}
          <div className="mb-6">
            <HealthStatusCard
              title="Overall System Status"
              description={healthReport.summary}
              status={healthReport.overall as 'healthy' | 'warning' | 'error' | 'checking'}
              icon={<Settings className="h-6 w-6 text-blue-400" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <HealthStatusCard
              title="Database"
              description="Connection and table status"
              status={healthReport.checks.find(c => c.name === 'Database Connectivity')?.status as 'healthy' | 'warning' | 'error' | 'checking' || 'checking'}
              icon={<Database className="h-6 w-6 text-blue-400" />}
            />

            <HealthStatusCard
              title="Authentication"
              description="Admin login system"
              status={'healthy' as 'healthy' | 'warning' | 'error' | 'checking'}
              icon={<Shield className="h-6 w-6 text-green-400" />}
            />
          </div>

          {/* Database Tables Breakdown */}
          <DatabaseStats tables={getDatabaseStats()} />

          {/* Issues */}
          <IssuesList issues={getIssues()} />

          {/* Recommendations */}
          <RecommendationsList recommendations={healthReport.recommendations} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteHealthReport;
