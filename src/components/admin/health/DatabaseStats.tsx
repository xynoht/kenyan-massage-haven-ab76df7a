
import React from "react";

interface DatabaseStatsProps {
  tables: Record<string, number>;
}

const DatabaseStats = ({ tables }: DatabaseStatsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-coral mb-3">Database Tables</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(tables).map(([table, count]) => (
          <div key={table} className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-300 text-sm capitalize">{table.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-white font-bold text-lg">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatabaseStats;
