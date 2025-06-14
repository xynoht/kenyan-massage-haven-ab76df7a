
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface HealthStatusCardProps {
  title?: string;
  description?: string;
  status: string;
  message?: string;
  details?: string;
  icon?: React.ReactNode;
}

const HealthStatusCard = ({ title, description, status, message, details, icon }: HealthStatusCardProps) => {
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

  // Use title/description if provided, otherwise fall back to message/details
  const displayTitle = title || message;
  const displayDescription = description || details;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-3">
        {icon || getStatusIcon(status)}
        <div>
          <p className="text-white font-semibold">{displayTitle}</p>
          <p className="text-gray-300 text-sm">{displayDescription}</p>
        </div>
      </div>
      {getStatusBadge(status)}
    </div>
  );
};

export default HealthStatusCard;
