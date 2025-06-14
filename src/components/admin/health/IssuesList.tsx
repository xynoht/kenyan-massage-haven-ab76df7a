
import React from "react";
import { AlertTriangle } from "lucide-react";

interface IssuesListProps {
  issues: string[];
}

const IssuesList = ({ issues }: IssuesListProps) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Issues Found ({issues.length})
      </h3>
      <div className="space-y-2">
        {issues.map((issue, index) => (
          <div key={index} className="bg-red-900/20 border border-red-500/20 p-3 rounded">
            <p className="text-red-200">{issue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesList;
