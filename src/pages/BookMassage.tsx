import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const durations = [
    { value: "15", label: "15 Minutes", price: 500 },
    { value: "30", label: "30 Minutes", price: 1000 },
    { value: "45", label: "45 Minutes", price: 1500 }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
      const cleanPhone = formData.phone.replace(/[\s-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = "Please enter a valid Kenyan phone number";
      }
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!date) {
      newErrors.date = "Please select a date";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time";
    }

    if (!formData.duration) {
      newErrors.duration = "Please select a duration";
    }

    if (!formData.branch) {
      newErrors.branch = "Please select a branch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors and try again.",
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

      // Normalize phone number
      let normalizedPhone = formData.phone.replace(/[\s-]/g, '');
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '254' + normalizedPhone.substring(1);
      } else if (!normalizedPhone.startsWith('254')) {
        normalizedPhone = '254' + normalizedPhone;
      }

      // Insert booking into database
      const bookingData = {
        name: formData.name.trim(),
        phone: normalizedPhone,
        email: formData.email.trim() || null,
        date: format(date!, 'yyyy-MM-dd'),
        time: formData.time,
        duration: parseInt(formData.duration),
        branch: formData.branch,
        notes: formData.notes.trim() || null,
        total_amount: selectedDuration.price,
        status: 'pending'
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      toast({
        title: "Booking Created!",
        description: "Please proceed to payment to confirm your booking.",
      });

      // Navigate to payment confirmation page
      navigate(`/payment-confirmation?amount=${selectedDuration.price}&referenceId=${booking.id}&type=booking&customerName=${encodeURIComponent(formData.name)}`);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: `Error: ${error.message || "There was an error processing your booking. Please try again."}`,
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
                          className={cn(
                            "bg-gray-700 border-gray-600 text-white",
                            errors.name && "border-red-500"
                          )}
                          required
                        />
                        {errors.name && (
                          <div className="flex items-center mt-1 text-red-400 text-sm">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.name}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={cn(
                            "bg-gray-700 border-gray-600 text-white",
                            errors.phone && "border-red-500"
                          )}
                          placeholder="+254 7XX XXX XXX"
                          required
                        />
                        {errors.phone && (
                          <div className="flex items-center mt-1 text-red-400 text-sm">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={cn(
                          "bg-gray-700 border-gray-600 text-white",
                          errors.email && "border-red-500"
                        )}
                      />
                      {errors.email && (
                        <div className="flex items-center mt-1 text-red-400 text-sm">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Branch Selection */}
                    <div>
                      <Label className="text-white">Select Branch *</Label>
                      <Select value={formData.branch} onValueChange={(value) => setFormData({...formData, branch: value})}>
                        <SelectTrigger className={cn(
                          "bg-gray-700 border-gray-600 text-white",
                          errors.branch && "border-red-500"
                        )}>
                          <SelectValue placeholder="Choose location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="the-hub-karen">The Hub, Karen</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.branch && (
                        <div className="flex items-center mt-1 text-red-400 text-sm">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.branch}
                        </div>
                      )}
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
                              !date && "text-gray-400",
                              errors.date && "border-red-500"
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
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.date && (
                        <div className="flex items-center mt-1 text-red-400 text-sm">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.date}
                        </div>
                      )}
                    </div>

                    {/* Time and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Select Time *</Label>
                        <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                          <SelectTrigger className={cn(
                            "bg-gray-700 border-gray-600 text-white",
                            errors.time && "border-red-500"
                          )}>
                            <SelectValue placeholder="Choose time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.time && (
                          <div className="flex items-center mt-1 text-red-400 text-sm">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.time}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-white">Duration *</Label>
                        <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                          <SelectTrigger className={cn(
                            "bg-gray-700 border-gray-600 text-white",
                            errors.duration && "border-red-500"
                          )}>
                            <SelectValue placeholder="Choose duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label} - KSh {duration.price.toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.duration && (
                          <div className="flex items-center mt-1 text-red-400 text-sm">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.duration}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-white">Special Requests (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Any special requests or preferences..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Booking..." : "Book Now"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gold/20 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl text-gold">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-white">
                    {formData.branch && (
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-gold">{formData.branch.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                    )}
                    {date && (
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="text-gold">{format(date, "MMM dd, yyyy")}</span>
                      </div>
                    )}
                    {formData.time && (
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-gold">{formData.time}</span>
                      </div>
                    )}
                    {selectedDuration && (
                      <>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="text-gold">{selectedDuration.label}</span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total:</span>
                          <span className="text-gold">KSh {selectedDuration.price.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookMassage;