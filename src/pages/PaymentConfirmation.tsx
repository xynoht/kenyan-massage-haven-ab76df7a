
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Copy, CheckCircle, CreditCard } from "lucide-react";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentDetails, setPaymentDetails] = useState({
    customerName: searchParams.get('customerName') || '',
    phoneNumber: '',
    transactionCode: '',
    notes: ''
  });
  
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const amount = parseInt(searchParams.get('amount') || '0');
  const referenceId = searchParams.get('referenceId') || '';
  const type = searchParams.get('type') || 'booking';

  const paybillNumber = "880100";
  const accountNumber = "8504260017";

  useEffect(() => {
    fetchBookingDetails();
  }, [referenceId, type]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const fetchBookingDetails = async () => {
    if (!referenceId) return;

    try {
      if (type === 'booking') {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', referenceId)
          .single();

        if (error) throw error;
        setBookingDetails(data);
      } else if (type === 'gift_voucher') {
        const { data, error } = await supabase
          .from('gift_vouchers')
          .select('*')
          .eq('id', referenceId)
          .single();

        if (error) throw error;
        setBookingDetails(data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      toast({
        title: "Error",
        description: "Could not fetch booking details",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDetails.customerName || !paymentDetails.phoneNumber || !paymentDetails.transactionCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit payment confirmation to database
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          reference_id: referenceId,
          amount: amount,
          transaction_id: paymentDetails.transactionCode,
          status: 'pending',
          transaction_type: type,
          payment_method: 'mpesa',
          currency: 'KES'
        });

      if (error) throw error;

      toast({
        title: "Payment Confirmation Submitted!",
        description: "We have received your payment details. We will verify and confirm your booking shortly.",
        duration: 6000,
      });

      // Redirect to success page after delay
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your payment details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Payment Instructions</h1>
          <p className="text-xl text-gray-300">
            Complete your payment to confirm your booking
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Payment Instructions */}
            <div>
              <Card className="bg-gray-800 border-gold/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl text-gold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    M-Pesa Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-3">M-Pesa Paybill Payment</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white rounded p-3">
                        <div>
                          <p className="text-sm text-gray-600">Pay Bill Number</p>
                          <p className="font-mono text-lg font-bold">{paybillNumber}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(paybillNumber, "Paybill number")}
                          className="ml-2"
                        >
                          {copied === "Paybill number" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white rounded p-3">
                        <div>
                          <p className="text-sm text-gray-600">Account Number</p>
                          <p className="font-mono text-lg font-bold">{accountNumber}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(accountNumber, "Account number")}
                          className="ml-2"
                        >
                          {copied === "Account number" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Amount:</strong> KSh {amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-yellow-800">
                          <strong>Reference:</strong> {referenceId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-green-700">
                      <h4 className="font-semibold mb-2">Step-by-Step Payment Guide:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Go to M-Pesa menu on your phone</li>
                        <li>Select "Lipa na M-Pesa"</li>
                        <li>Select "Pay Bill"</li>
                        <li>Enter Pay Bill Number: <strong>{paybillNumber}</strong></li>
                        <li>Enter Account Number: <strong>{accountNumber}</strong></li>
                        <li>Enter Amount: <strong>KSh {amount.toLocaleString()}</strong></li>
                        <li>Enter your M-Pesa PIN</li>
                        <li>Confirm payment</li>
                        <li>Take a screenshot of the confirmation message</li>
                        <li>Fill the form below to complete your booking</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              {bookingDetails && (
                <Card className="bg-gray-800 border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-white space-y-2">
                    {type === 'booking' && (
                      <>
                        <div className="flex justify-between">
                          <span>Service:</span>
                          <span className="text-gold">{bookingDetails.duration} minutes massage</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="text-gold">{bookingDetails.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="text-gold">{bookingDetails.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Branch:</span>
                          <span className="text-gold">{bookingDetails.branch}</span>
                        </div>
                      </>
                    )}
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-gold">KSh {amount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Confirmation Form */}
            <div>
              <Card className="bg-gray-800 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-xl text-gold">Confirm Your Payment</CardTitle>
                  <p className="text-gray-300">After making the M-Pesa payment, fill this form to complete your booking</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="customerName" className="text-white">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={paymentDetails.customerName}
                        onChange={(e) => setPaymentDetails({...paymentDetails, customerName: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="text-white">Phone Number Used for Payment *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="+254 7XX XXX XXX"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="transactionCode" className="text-white">M-Pesa Transaction Code *</Label>
                      <Input
                        id="transactionCode"
                        value={paymentDetails.transactionCode}
                        onChange={(e) => setPaymentDetails({...paymentDetails, transactionCode: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="e.g., QGH7H8K9L0"
                        required
                      />
                      <p className="text-sm text-gray-400 mt-1">Found in your M-Pesa confirmation message</p>
                    </div>

                    <div>
                      <Label htmlFor="screenshot" className="text-white">Upload Payment Screenshot (Optional)</Label>
                      <div className="mt-2">
                        <input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('screenshot')?.click()}
                          className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {screenshot ? screenshot.name : "Choose Image"}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-white">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={paymentDetails.notes}
                        onChange={(e) => setPaymentDetails({...paymentDetails, notes: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                        placeholder="Any additional information..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Confirming Payment..." : "Confirm Payment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentConfirmation;
