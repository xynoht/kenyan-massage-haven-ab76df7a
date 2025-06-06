
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PaymentModal from "@/components/PaymentModal";

const BookMassage = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    duration: "",
    branch: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const durations = [
    { value: "15", label: "15 Minutes - Ksh 500", price: 500 },
    { value: "30", label: "30 Minutes - Ksh 1,000", price: 1000 },
    { value: "45", label: "45 Minutes - Ksh 1,500", price: 1500 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !formData.name || !formData.phone || !formData.time || !formData.duration || !formData.branch) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDuration = durations.find(d => d.value === formData.duration);
      if (!selectedDuration) {
        throw new Error("Invalid duration selected");
      }

      // Insert booking into database
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          date: format(date, 'yyyy-MM-dd'),
          time: formData.time,
          duration: parseInt(formData.duration),
          branch: formData.branch,
          notes: formData.notes,
          total_amount: selectedDuration.price,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "Booking Request Received!",
        description: "Please complete payment using the instructions provided.",
      });

      // Open payment modal
      setCurrentBookingId(booking.id);
      setShowPaymentModal(true);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        time: "",
        duration: "",
        branch: "",
        notes: ""
      });
      setDate(undefined);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDuration = durations.find(d => d.value === formData.duration);

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Book Your Massage</h1>
          <p className="text-xl text-gray-300">
            Schedule your perfect relaxation session at Priella Massage Therapy Station
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-gold">Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="+254 7XX XXX XXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    {/* Branch Selection */}
                    <div>
                      <Label className="text-white">Select Branch *</Label>
                      <Select value={formData.branch} onValueChange={(value) => setFormData({...formData, branch: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Choose location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="the-hub-karen">The Hub, Karen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label className="text-white">Select Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white",
                              !date && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Select Time *</Label>
                        <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white">Duration *</Label>
                        <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-white">Special Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Any special requests or health considerations..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-coral hover:bg-coral/90 text-black font-semibold py-3"
                    >
                      {isSubmitting ? "Processing..." : "Book & Get Payment Instructions"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="bg-gray-800 border-gold/20 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl text-gold">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-coral" />
                    <span>{formData.branch || "Select branch"}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <CalendarIcon className="h-4 w-4 mr-2 text-coral" />
                    <span>{date ? format(date, "PPP") : "Select date"}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-coral" />
                    <span>{formData.time || "Select time"}</span>
                  </div>

                  {selectedDuration && (
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white">{selectedDuration.value} Minutes</span>
                        <span className="text-coral font-semibold">Ksh {selectedDuration.price}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-gold font-semibold mb-2">What to Expect:</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• AI-powered massage chair experience</li>
                      <li>• Clean, sanitized environment</li>
                      <li>• Professional wellness guidance</li>
                      <li>• Relaxing atmosphere</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && currentBookingId && selectedDuration && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={selectedDuration.price}
          referenceId={currentBookingId}
          transactionType="booking"
          description="Massage Session Booking"
        />
      )}
    </div>
  );
};

export default BookMassage;
