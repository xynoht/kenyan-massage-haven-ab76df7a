
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { healthMonitor, SystemHealthReport as HealthReport } from "@/utils/healthSystem";
import HealthDashboard from "./health/HealthDashboard";

const SiteHealthReport = () => {
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const report = await healthMonitor.performComprehensiveHealthCheck();
      setHealthReport(report);
      
      const { errorCount, warningCount } = report.metrics;
      
      if (errorCount > 0) {
        toast({
          title: "Health Check Complete",
          description: `Found ${errorCount} critical issues to address.`,
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
          <HealthDashboard />
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteHealthReport;
