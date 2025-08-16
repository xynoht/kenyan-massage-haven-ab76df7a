import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Gift, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const VoucherRedemption = () => {
  const [step, setStep] = useState(1); // 1: Enter code, 2: Book session, 3: Confirmation
  const [voucher, setVoucher] = useState<any>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [date, setDate] = useState<Date>();
  const [bookingData, setBookingData] = useState({
    time: "",
    duration: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const durations = [
    { value: "15", label: "15 Minutes (Ksh 500)", price: 500 },
    { value: "30", label: "30 Minutes (Ksh 1,000)", price: 1000 },
    { value: "45", label: "45 Minutes (Ksh 1,500)", price: 1500 }
  ];

  const validateVoucher = async () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Missing Voucher Code",
        description: "Please enter your voucher code.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Check if voucher exists and is active
      const { data, error } = await supabase
        .from('gift_vouchers')
        .select('*')
        .eq('voucher_code', voucherCode.toUpperCase().trim())
        .eq('status', 'active')
        .eq('payment_status', 'completed')
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Voucher",
          description: "Voucher code not found or already used. Please check your code and try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if voucher is expired
      const now = new Date();
      const expiryDate = new Date(data.expires_at);
      if (expiryDate < now) {
        toast({
          title: "Voucher Expired",
          description: "This voucher has expired. Please contact us for assistance.",
          variant: "destructive",
        });
        return;
      }

      setVoucher(data);
      setStep(2);
      toast({
        title: "Voucher Validated!",
        description: `Valid voucher for Ksh ${data.amount}. Proceed to book your session.`,
      });

    } catch (error) {
      console.error('Voucher validation error:', error);
      toast({
        title: "Validation Error",
        description: "There was an error validating your voucher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const redeemVoucher = async () => {
    if (!date || !bookingData.time || !bookingData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required booking details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check availability
      const { data: existingBookings, error: availabilityError } = await supabase
        .from('bookings')
        .select('time, duration')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .eq('branch', voucher.branch)
        .in('status', ['pending', 'confirmed']);

      if (availabilityError) throw availabilityError;

      // Simple time conflict check
      const hasConflict = existingBookings.some(booking => booking.time === bookingData.time);
      if (hasConflict) {
        toast({
          title: "Time Slot Unavailable",
          description: "The selected time slot is already booked. Please choose a different time.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const selectedDuration = durations.find(d => d.value === bookingData.duration);
      if (!selectedDuration) {
        throw new Error("Invalid duration selected");
      }

      // Check if voucher amount covers the session cost
      if (voucher.amount < selectedDuration.price) {
        toast({
          title: "Insufficient Voucher Value",
          description: `This voucher (Ksh ${voucher.amount}) cannot cover a ${selectedDuration.label.split(' ')[0]} minute session (${selectedDuration.label}). Please select a different duration or contact us for assistance.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          name: voucher.recipient_name,
          phone: voucher.recipient_phone,
          email: null,
          date: format(date, 'yyyy-MM-dd'),
          time: bookingData.time,
          duration: parseInt(bookingData.duration),
          branch: voucher.branch,
          notes: `Voucher redemption - Code: ${voucher.voucher_code}. ${bookingData.notes || ''}`.trim(),
          total_amount: 0, // No charge as it's paid by voucher
          status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Mark voucher as redeemed
      const { error: voucherUpdateError } = await supabase
        .from('gift_vouchers')
        .update({ 
          status: 'redeemed',
          // You might want to add a redeemed_at timestamp column in the future
        })
        .eq('id', voucher.id);

      if (voucherUpdateError) throw voucherUpdateError;

      setStep(3);
      toast({
        title: "Voucher Redeemed Successfully!",
        description: "Your massage session has been booked. We look forward to seeing you!",
      });

    } catch (error) {
      console.error('Voucher redemption error:', error);
      toast({
        title: "Redemption Failed",
        description: "There was an error redeeming your voucher. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Gift className="h-16 w-16 text-coral mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gold mb-6">Redeem Gift Voucher</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enter your voucher code and book your relaxing massage session at Priella
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNum ? 'bg-coral text-black' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > stepNum ? '✓' : stepNum}
                </div>
                <span className={`ml-3 text-sm ${step >= stepNum ? 'text-coral' : 'text-gray-400'}`}>
                  {stepNum === 1 ? 'Validate' : stepNum === 2 ? 'Book' : 'Confirm'}
                </span>
                {stepNum < 3 && <div className={`w-16 h-0.5 ml-8 ${step > stepNum ? 'bg-coral' : 'bg-gray-700'}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 1 && (
            <Card className="bg-gray-800 border-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gold">Enter Voucher Code</CardTitle>
                <p className="text-gray-300">Please enter the voucher code you received</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="voucherCode" className="text-white">Voucher Code *</Label>
                  <Input
                    id="voucherCode"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="bg-gray-700 border-gray-600 text-white text-center text-lg font-mono"
                    placeholder="PRI-XXXXXXXX"
                    maxLength={12}
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Enter the 12-character code from your gift voucher
                  </p>
                </div>
                
                <Button 
                  onClick={validateVoucher}
                  disabled={isValidating || !voucherCode.trim()}
                  className="w-full bg-coral hover:bg-coral/90 text-black font-semibold py-3"
                >
                  {isValidating ? "Validating..." : "Validate Voucher"}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && voucher && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gold">Book Your Session</CardTitle>
                    <p className="text-gray-300">Select your preferred date and time</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const maxDate = new Date();
                              maxDate.setMonth(maxDate.getMonth() + 3);
                              return date < today || date > maxDate;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Select Time *</Label>
                        <Select value={bookingData.time} onValueChange={(value) => setBookingData({...bookingData, time: value})}>
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
                        <Select value={bookingData.duration} onValueChange={(value) => setBookingData({...bookingData, duration: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((duration) => {
                              const canAfford = voucher.amount >= duration.price;
                              return (
                                <SelectItem 
                                  key={duration.value} 
                                  value={duration.value}
                                  disabled={!canAfford}
                                  className={!canAfford ? "opacity-50" : ""}
                                >
                                  {duration.label} {!canAfford ? "(Insufficient voucher value)" : ""}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      onClick={redeemVoucher}
                      disabled={isSubmitting || !date || !bookingData.time || !bookingData.duration}
                      className="w-full bg-coral hover:bg-coral/90 text-black font-semibold py-3"
                    >
                      {isSubmitting ? "Booking Session..." : "Redeem Voucher & Book"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Voucher Details */}
              <div>
                <Card className="bg-gradient-to-br from-coral to-gold text-black sticky top-24">
                  <CardHeader className="text-center">
                    <Gift className="h-12 w-12 mx-auto mb-4" />
                    <CardTitle className="text-2xl">Valid Voucher</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-black/20 rounded-lg p-4 mb-4">
                      <h3 className="text-xl font-bold mb-2">PRIELLA</h3>
                      <p className="text-sm">Massage Therapy Station</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Recipient:</strong> {voucher.recipient_name}</p>
                      <p><strong>Value:</strong> Ksh {voucher.amount}</p>
                      <p><strong>Valid At:</strong> {voucher.branch === 'the-hub-karen' ? 'The Hub, Karen' : voucher.branch}</p>
                      <p><strong>Code:</strong> {voucher.voucher_code}</p>
                      <p><strong>Expires:</strong> {format(new Date(voucher.expires_at), 'MMM dd, yyyy')}</p>
                    </div>
                    
                    {voucher.message && (
                      <div className="bg-black/20 rounded-lg p-3 mt-4">
                        <p className="text-sm italic">"{voucher.message}"</p>
                        <p className="text-xs mt-2">- {voucher.sender_name}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 3 && (
            <Card className="bg-gray-800 border-gold/20">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gold mb-4">Voucher Redeemed Successfully!</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Your massage session has been confirmed. We look forward to providing you with a relaxing experience.
                </p>
                
                <div className="bg-gray-700 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-coral mb-4">Booking Details</h3>
                  <div className="text-gray-300 space-y-2">
                    <p><strong>Date:</strong> {date && format(date, 'PPPP')}</p>
                    <p><strong>Time:</strong> {bookingData.time}</p>
                    <p><strong>Duration:</strong> {bookingData.duration} minutes</p>
                    <p><strong>Location:</strong> The Hub, Karen</p>
                    <p><strong>Recipient:</strong> {voucher?.recipient_name}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/contact')}
                    className="bg-coral hover:bg-coral/90 text-black"
                  >
                    Contact Us
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-black"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Help Section */}
      {step === 1 && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gold mb-4">Need Help?</h2>
              <p className="text-gray-300">Having trouble with your voucher code?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gold/20">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-coral mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gold mb-2">Lost Your Code?</h3>
                  <p className="text-gray-300 mb-4">If you've lost your voucher code, contact us with your phone number and we'll help you recover it.</p>
                  <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-black">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gold/20">
                <CardContent className="p-6 text-center">
                  <Gift className="h-12 w-12 text-coral mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gold mb-2">How to Use</h3>
                  <p className="text-gray-300 mb-4">Enter your 12-character voucher code exactly as it appears on your gift voucher or in your confirmation message.</p>
                  <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-black">
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default VoucherRedemption;