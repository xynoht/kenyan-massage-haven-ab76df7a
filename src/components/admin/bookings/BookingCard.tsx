
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Clock, MapPin, User, CheckCircle, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";

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

interface BookingCardProps {
  booking: Booking;
  onStatusUpdate: (bookingId: string, newStatus: string) => Promise<void>;
  onViewDetails: (booking: Booking) => void;
}

const BookingCard = ({ booking, onStatusUpdate, onViewDetails }: BookingCardProps) => {
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

  return (
    <Card className="bg-gray-800 border-gold/20">
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
              onClick={() => onViewDetails(booking)}
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
                  onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <Button
                size="sm"
                onClick={() => onStatusUpdate(booking.id, 'completed')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Mark Complete
              </Button>
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
  );
};

export default BookingCard;
