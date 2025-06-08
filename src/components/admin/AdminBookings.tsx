
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Clock, MapPin, User, CheckCircle, XCircle, Eye, AlertCircle, RefreshCw, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
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

  const sendBookingConfirmation = async (booking: Booking) => {
    try {
      console.log('Sending booking confirmation for:', booking.id);
      
      const response = await fetch('/api/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          customerName: booking.name,
          customerPhone: booking.phone,
          customerEmail: booking.email,
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          branch: booking.branch,
          totalAmount: booking.total_amount,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Confirmation sent successfully:', result);
        
        toast({
          title: "Confirmation Sent",
          description: `Booking confirmation has been sent to ${booking.name} via ${result.whatsappSent ? 'WhatsApp' : result.emailSent ? 'email' : 'SMS'}.`,
        });
      } else {
        throw new Error('Failed to send confirmation');
      }
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      toast({
        title: "Notification Error",
        description: "Failed to send booking confirmation. The booking status has been updated.",
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // If confirming a booking, send notification
      if (newStatus === 'confirmed') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          await sendBookingConfirmation(booking);
        }
      }

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}.`,
      });

      fetchBookings();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-orange-500 text-white">Pending</Badge>;
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
      <Card className="bg-gray-800 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center justify-between">
            Filter Bookings
            <Button 
              onClick={fetchBookings}
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <Select value={dateFilter} onValueChange={setDateFilter}>
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
            <Card key={booking.id} className="bg-gray-800 border-gold/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-white">
                      <User className="h-4 w-4 mr-2 text-coral" />
                      <span className="font-semibold">{booking.name}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{booking.phone}</span>
                    </div>
                    {booking.email && (
                      <div className="text-gray-300 text-sm">
                        {booking.email}
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-white">
                      <Calendar className="h-4 w-4 mr-2 text-coral" />
                      <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.time} ({booking.duration} mins)</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{booking.branch}</span>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="space-y-2">
                    <div className="text-green-400 font-semibold">
                      KSh {booking.total_amount.toLocaleString()}
                    </div>
                    {getStatusBadge(booking.status)}
                    <div className="text-xs text-gray-400">
                      Booked: {format(new Date(booking.created_at), 'MMM dd, HH:mm')}
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openBookingDetails(booking)}
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm & Notify
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Mark Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendBookingConfirmation(booking)}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Resend Notice
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 p-3 bg-gray-700 rounded">
                    <p className="text-sm text-gray-300">
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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
