
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BookingFilters from "./bookings/BookingFilters";
import BookingCard from "./bookings/BookingCard";
import BookingDetails from "./BookingDetails";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  total_amount: number;
  status: string;
  branch: string;
  notes: string;
  created_at: string;
}

interface AdminBookingsProps {
  onStatsUpdate: () => void;
}

const AdminBookings = ({ onStatsUpdate }: AdminBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    console.log('Starting to fetch bookings...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Making Supabase query...');
      const { data, error, count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error, count });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} bookings`);
      setBookings(data || []);
      
      if (!data || data.length === 0) {
        setError('No bookings found in the database');
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      const errorMessage = error.message || 'Failed to load bookings';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    console.log(`Filtering ${bookings.length} bookings with status: ${statusFilter}, date: ${dateFilter}`);
    let filtered = [...bookings];

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
      console.log(`After status filter: ${filtered.length} bookings`);
    }

    if (dateFilter !== "all") {
      const today = new Date();
      
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(booking => {
            const bDate = new Date(booking.date);
            return bDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => {
            const bDate = new Date(booking.date);
            return bDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => {
            const bDate = new Date(booking.date);
            return bDate >= monthAgo;
          });
          break;
      }
      console.log(`After date filter: ${filtered.length} bookings`);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      console.log(`Updating booking ${bookingId} status to ${newStatus}`);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        throw error;
      }

      console.log('Booking status updated successfully');
      
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}.`,
      });

      await fetchBookings();
      onStatsUpdate();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    }
  };

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
    setShowDetails(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gold/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading bookings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-400 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Error Loading Bookings</span>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Possible reasons:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>No bookings have been made yet</li>
              <li>Database connection issues</li>
              <li>Permission/authentication problems</li>
              <li>Table structure mismatch</li>
            </ul>
          </div>
          <Button 
            onClick={fetchBookings}
            className="mt-4 bg-coral hover:bg-coral/90 text-black"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Loading
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <Card className="bg-gray-800 border-blue-500/20">
        <CardContent className="p-4">
          <div className="text-sm text-blue-400">
            <p>Debug Info: Total bookings: {bookings.length} | Filtered: {filteredBookings.length}</p>
            <p>Filters: Status = {statusFilter}, Date = {dateFilter}</p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <BookingFilters
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onRefresh={fetchBookings}
      />

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-300 text-lg mb-2">No bookings found</p>
                  <p className="text-gray-500 text-sm">
                    {bookings.length === 0 
                      ? "No bookings have been made yet. Bookings will appear here once customers make appointments."
                      : `No bookings match your current filters. Try adjusting the status or date filters above.`
                    }
                  </p>
                </div>
                {bookings.length === 0 && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>To test this feature, you can:</p>
                    <p>1. Make a test booking through the booking page</p>
                    <p>2. Add sample data directly to the database</p>
                    <p>3. Check if the booking form is working correctly</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusUpdate={updateBookingStatus}
              onViewDetails={openBookingDetails}
            />
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      <BookingDetails
        booking={selectedBooking}
        isOpen={showDetails}
        onClose={closeBookingDetails}
      />
    </div>
  );
};

export default AdminBookings;
