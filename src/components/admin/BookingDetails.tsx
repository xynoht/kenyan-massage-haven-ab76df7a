
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Clock, MapPin, User, Mail, FileText, DollarSign } from "lucide-react";
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

interface BookingDetailsProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetails = ({ booking, isOpen, onClose }: BookingDetailsProps) => {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-orange-500';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gold flex items-center">
            <User className="h-6 w-6 mr-2" />
            Booking Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <Badge className={`${getStatusColor(booking.status)} text-white text-lg px-4 py-2`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <div className="text-right text-gray-400 text-sm">
              <div>Booking ID: {booking.id.slice(0, 8)}</div>
              <div>Created: {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}</div>
            </div>
          </div>

          {/* Customer Information */}
          <Card className="bg-gray-700 border-gold/20">
            <CardHeader>
              <CardTitle className="text-coral flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <div className="text-white font-medium">{booking.name}</div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Phone Number</label>
                  <div className="text-white font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-coral" />
                    {booking.phone}
                  </div>
                </div>
              </div>
              {booking.email && (
                <div>
                  <label className="text-gray-400 text-sm">Email Address</label>
                  <div className="text-white font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-coral" />
                    {booking.email}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card className="bg-gray-700 border-gold/20">
            <CardHeader>
              <CardTitle className="text-coral flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Date</label>
                  <div className="text-white font-medium">{formatDate(booking.date)}</div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Time</label>
                  <div className="text-white font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-coral" />
                    {formatTime(booking.time)}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Duration</label>
                  <div className="text-white font-medium">{booking.duration} minutes</div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Branch</label>
                  <div className="text-white font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-coral" />
                    {booking.branch}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="bg-gray-700 border-gold/20">
            <CardHeader>
              <CardTitle className="text-coral flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                KSh {booking.total_amount.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm mt-1">Total Amount</div>
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card className="bg-gray-700 border-gold/20">
              <CardHeader>
                <CardTitle className="text-coral flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white bg-gray-600 p-3 rounded">
                  {booking.notes}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <Button 
              onClick={onClose}
              className="bg-coral hover:bg-coral/90 text-black"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetails;
