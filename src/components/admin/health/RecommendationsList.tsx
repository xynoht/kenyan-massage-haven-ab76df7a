
import React from "react";
import { FileText } from "lucide-react";

interface RecommendationsListProps {
  recommendations: string[];
}

const RecommendationsList = ({ recommendations }: RecommendationsListProps) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        Recommendations
      </h3>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-blue-900/20 border border-blue-500/20 p-3 rounded">
            <p className="text-blue-200">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
