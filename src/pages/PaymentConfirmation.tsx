
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle, Clock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentData, setPaymentData] = useState({
    customerName: "",
    phoneNumber: "",
    transactionCode: "",
    notes: "",
    screenshot: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  const amount = searchParams.get('amount') || '0';
  const referenceId = searchParams.get('reference') || '';
  const type = searchParams.get('type') || 'booking';
  const customerName = decodeURIComponent(searchParams.get('name') || '');

  useEffect(() => {
    if (referenceId) {
      fetchBookingDetails();
    }
    if (customerName) {
      setPaymentData(prev => ({ ...prev, customerName }));
    }
  }, [referenceId, customerName]);

  const fetchBookingDetails = async () => {
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
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setPaymentData({...paymentData, screenshot: file});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.customerName || !paymentData.phoneNumber || !paymentData.transactionCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would normally upload the screenshot and save payment confirmation
      // For now, we'll just save the payment details
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          amount: parseInt(amount),
          reference_id: referenceId,
          transaction_type: type,
          payment_method: 'mpesa',
          status: 'pending',
          transaction_id: paymentData.transactionCode
        });

      if (error) throw error;

      toast({
        title: "Payment Confirmation Submitted!",
        description: "We'll verify your payment and confirm your booking shortly.",
      });

      // Navigate back to appropriate page
      setTimeout(() => {
        if (type === 'booking') {
          navigate('/book-massage');
        } else {
          navigate('/gift-voucher');
        }
      }, 2000);

    } catch (error) {
      console.error('Payment confirmation error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your payment confirmation.",
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
          <CreditCard className="h-16 w-16 text-coral mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gold mb-4">Payment Confirmation</h1>
          <p className="text-xl text-gray-300">
            Complete your payment using M-Pesa and upload your confirmation
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Instructions */}
            <Card className="bg-gray-800 border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gold">M-Pesa Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-coral to-gold p-6 rounded-lg text-black">
                  <h3 className="text-xl font-bold mb-4">Payment Details</h3>
                  <div className="space-y-2">
                    <p><strong>Pay Bill Number:</strong> 880100</p>
                    <p><strong>Account Number:</strong> 8504260017</p>
                    <p><strong>Amount:</strong> Ksh {amount}</p>
                    <p><strong>Reference:</strong> {referenceId.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-coral">How to Pay:</h4>
                  <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                    <li>Go to M-Pesa on your phone</li>
                    <li>Select "Lipa na M-Pesa"</li>
                    <li>Select "Pay Bill"</li>
                    <li>Enter Pay Bill Number: <strong className="text-coral">880100</strong></li>
                    <li>Enter Account Number: <strong className="text-coral">8504260017</strong></li>
                    <li>Enter Amount: <strong className="text-coral">Ksh {amount}</strong></li>
                    <li>Enter your M-Pesa PIN</li>
                    <li>Take a screenshot of the confirmation message</li>
                    <li>Upload the screenshot using the form</li>
                  </ol>
                </div>

                {bookingDetails && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gold mb-2">
                      {type === 'booking' ? 'Booking Details' : 'Voucher Details'}
                    </h4>
                    <div className="text-gray-300 space-y-1">
                      {type === 'booking' ? (
                        <>
                          <p><strong>Name:</strong> {bookingDetails.name}</p>
                          <p><strong>Date:</strong> {bookingDetails.date}</p>
                          <p><strong>Time:</strong> {bookingDetails.time}</p>
                          <p><strong>Duration:</strong> {bookingDetails.duration} minutes</p>
                        </>
                      ) : (
                        <>
                          <p><strong>Recipient:</strong> {bookingDetails.recipient_name}</p>
                          <p><strong>Amount:</strong> Ksh {bookingDetails.amount}</p>
                          <p><strong>Sender:</strong> {bookingDetails.sender_name}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Confirmation Form */}
            <Card className="bg-gray-800 border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gold">Upload Payment Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="customerName" className="text-white">Your Name *</Label>
                    <Input
                      id="customerName"
                      value={paymentData.customerName}
                      onChange={(e) => setPaymentData({...paymentData, customerName: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-white">Phone Number Used for Payment *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={paymentData.phoneNumber}
                      onChange={(e) => setPaymentData({...paymentData, phoneNumber: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="254XXXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="transactionCode" className="text-white">M-Pesa Transaction Code *</Label>
                    <Input
                      id="transactionCode"
                      value={paymentData.transactionCode}
                      onChange={(e) => setPaymentData({...paymentData, transactionCode: e.target.value.toUpperCase()})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="e.g. QH75XXXX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="screenshot" className="text-white">Upload Payment Screenshot</Label>
                    <div className="mt-2">
                      <label htmlFor="screenshot" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-coral transition-colors">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-300">
                            {paymentData.screenshot ? paymentData.screenshot.name : "Click to upload screenshot"}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                        </div>
                      </label>
                      <input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-coral hover:bg-coral/90 text-black font-semibold py-3"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Payment Confirmation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentConfirmation;
