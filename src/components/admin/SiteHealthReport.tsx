
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
import { performSiteHealthCheck } from "@/utils/testDataGenerator";
import HealthStatusCard from "./health/HealthStatusCard";
import DatabaseStats from "./health/DatabaseStats";
import IssuesList from "./health/IssuesList";
import RecommendationsList from "./health/RecommendationsList";

interface HealthReportSuccess {
  database: {
    status: string;
    tables: Record<string, number>;
  };
  authentication: {
    status: string;
  };
  navigation: {
    status: string;
  };
  adminDashboard: {
    status: string;
  };
  forms: {
    status: string;
  };
  issues: string[];
  recommendations: string[];
}

interface HealthReportError {
  status: string;
  message: string;
  error: string;
}

type HealthReport = HealthReportSuccess | HealthReportError;

const SiteHealthReport = () => {
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const report = await performSiteHealthCheck();
      setHealthReport(report);
      
      if (isSuccessReport(report) && report.issues && report.issues.length > 0) {
        toast({
          title: "Health Check Complete",
          description: `Found ${report.issues.length} potential issues to review.`,
          variant: "destructive",
        });
      } else if (isSuccessReport(report)) {
        toast({
          title: "Health Check Complete",
          description: "Site appears to be healthy!",
        });
      } else {
        toast({
          title: "Health Check Failed",
          description: report.message || "Could not complete the health check.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: "Could not complete the health check.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccessReport = (report: HealthReport): report is HealthReportSuccess => {
    return 'database' in report && 'issues' in report;
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

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

  // Handle error case
  if (!isSuccessReport(healthReport)) {
    return (
      <Card className="bg-gray-800 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Site Health Report - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-900/20 border border-red-500/20 p-4 rounded">
            <p className="text-red-200">{healthReport.message}</p>
            {healthReport.error && (
              <p className="text-red-300 text-sm mt-2">Error: {healthReport.error}</p>
            )}
          </div>
          <Button
            onClick={runHealthCheck}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-coral text-coral hover:bg-coral hover:text-black mt-4"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Retry Check
          </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <HealthStatusCard
              title="Database"
              description={healthReport.database?.tables ? 
                `${Object.values(healthReport.database.tables).reduce((a: number, b: number) => a + b, 0)} total records` : 
                'Connection status'
              }
              status={healthReport.database?.status}
              icon={<Database className="h-6 w-6 text-blue-400" />}
            />

            <HealthStatusCard
              title="Authentication"
              description="Admin login system"
              status={healthReport.authentication?.status}
              icon={<Shield className="h-6 w-6 text-green-400" />}
            />
          </div>

          {/* Database Tables Breakdown */}
          {healthReport.database?.tables && (
            <DatabaseStats tables={healthReport.database.tables} />
          )}

          {/* Issues */}
          <IssuesList issues={healthReport.issues} />

          {/* Recommendations */}
          <RecommendationsList recommendations={healthReport.recommendations} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteHealthReport;
