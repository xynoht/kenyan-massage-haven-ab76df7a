
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Activity } from "lucide-react";
import { SystemHealthReport } from "@/utils/healthSystem";

interface HealthOverviewProps {
  report: SystemHealthReport;
}

const HealthOverview = ({ report }: HealthOverviewProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
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

  return (
    <Card className="bg-gray-800 border-gold/20 mb-6">
      <CardHeader>
        <CardTitle className="text-gold flex items-center">
          {getStatusIcon(report.overall)}
          <span className="ml-2">System Health Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{report.metrics.totalChecks}</p>
            <p className="text-sm text-gray-300">Total Checks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{report.metrics.healthyCount}</p>
            <p className="text-sm text-gray-300">Healthy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{report.metrics.warningCount}</p>
            <p className="text-sm text-gray-300">Warnings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{report.metrics.errorCount}</p>
            <p className="text-sm text-gray-300">Errors</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Badge className={getStatusColor(report.overall)}>
              {report.overall.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-gray-400">
            Last checked: {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
        
        <p className="text-gray-300 mt-3">{report.summary}</p>
      </CardContent>
    </Card>
  );
};

export default HealthOverview;
