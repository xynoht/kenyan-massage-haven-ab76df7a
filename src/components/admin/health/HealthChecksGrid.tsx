
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Database, Shield, Zap, Settings } from "lucide-react";
import { HealthCheck } from "@/utils/healthSystem";

interface HealthChecksGridProps {
  checks: HealthCheck[];
}

const HealthChecksGrid = ({ checks }: HealthChecksGridProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database':
        return <Database className="h-4 w-4 text-blue-400" />;
      case 'security':
        return <Shield className="h-4 w-4 text-green-400" />;
      case 'performance':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
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

  // Group checks by category
  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, HealthCheck[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-coral mb-3 flex items-center capitalize">
            {getCategoryIcon(category)}
            <span className="ml-2">{category} Checks</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryChecks.map((check) => (
              <Card key={check.id} className="bg-gray-800 border-gold/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{check.name}</span>
                    {getStatusIcon(check.status)}
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{check.message}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(check.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
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
      ))}
    </div>
  );
};

export default HealthChecksGrid;
