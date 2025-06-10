
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database,
  Shield,
  Navigation,
  FileText,
  Settings,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performSiteHealthCheck } from "@/utils/testDataGenerator";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500 text-white">Healthy</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Checking</Badge>;
    }
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
            {/* Database Status */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Database</p>
                  <p className="text-gray-300 text-sm">
                    {healthReport.database?.tables ? 
                      `${Object.values(healthReport.database.tables).reduce((a: number, b: number) => a + b, 0)} total records` : 
                      'Connection status'
                    }
                  </p>
                </div>
              </div>
              {getStatusBadge(healthReport.database?.status)}
            </div>

            {/* Authentication Status */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-400" />
                <div>
                  <p className="text-white font-semibold">Authentication</p>
                  <p className="text-gray-300 text-sm">Admin login system</p>
                </div>
              </div>
              {getStatusBadge(healthReport.authentication?.status)}
            </div>
          </div>

          {/* Database Tables Breakdown */}
          {healthReport.database?.tables && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-coral mb-3">Database Tables</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(healthReport.database.tables).map(([table, count]) => (
                  <div key={table} className="bg-gray-700 p-3 rounded text-center">
                    <p className="text-gray-300 text-sm capitalize">{table.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-white font-bold text-lg">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {healthReport.issues && healthReport.issues.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Issues Found ({healthReport.issues.length})
              </h3>
              <div className="space-y-2">
                {healthReport.issues.map((issue, index) => (
                  <div key={index} className="bg-red-900/20 border border-red-500/20 p-3 rounded">
                    <p className="text-red-200">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {healthReport.recommendations && healthReport.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recommendations
              </h3>
              <div className="space-y-2">
                {healthReport.recommendations.map((rec, index) => (
                  <div key={index} className="bg-blue-900/20 border border-blue-500/20 p-3 rounded">
                    <p className="text-blue-200">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteHealthReport;
