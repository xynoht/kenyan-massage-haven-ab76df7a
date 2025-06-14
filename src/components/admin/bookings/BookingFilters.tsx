
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

interface BookingFiltersProps {
  statusFilter: string;
  dateFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onRefresh: () => void;
}

const BookingFilters = ({
  statusFilter,
  dateFilter,
  onStatusFilterChange,
  onDateFilterChange,
  onRefresh
}: BookingFiltersProps) => {
  return (
    <Card className="bg-gray-800 border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center justify-between">
          Filter Bookings
          <Button 
            onClick={onRefresh}
            size="sm"
            variant="outline"
            className="border-coral text-coral hover:bg-coral hover:text-black"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-white text-sm mb-2 block">Date Range</label>
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingFilters;
