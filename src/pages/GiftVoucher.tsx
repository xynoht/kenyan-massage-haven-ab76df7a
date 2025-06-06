import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PaymentModal from "@/components/PaymentModal";

const GiftVoucher = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    recipientName: "",
    recipientPhone: "",
    message: "",
    amount: "",
    branch: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentVoucherId, setCurrentVoucherId] = useState<string | null>(null);
  const { toast } = useToast();

  const voucherAmounts = [
    { value: "500", label: "Ksh 500 - 15 Min Session" },
    { value: "1000", label: "Ksh 1,000 - 30 Min Session" },
    { value: "1500", label: "Ksh 1,500 - 45 Min Session" },
    { value: "custom", label: "Custom Amount" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.senderName || !formData.recipientName || !formData.recipientPhone || !formData.amount || !formData.branch) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a placeholder voucher code (will be overridden by DB trigger)
      const temporaryVoucherCode = `TEMP-${Date.now()}`;
      
      // Insert gift voucher into database
      const { data: voucher, error: voucherError } = await supabase
        .from('gift_vouchers')
        .insert({
          sender_name: formData.senderName,
          recipient_name: formData.recipientName,
          recipient_phone: formData.recipientPhone,
          message: formData.message,
          amount: parseInt(formData.amount),
          branch: formData.branch,
          status: 'active',
          payment_status: 'pending',
          voucher_code: temporaryVoucherCode // Add this to satisfy TypeScript
        })
        .select()
        .single();

      if (voucherError) throw voucherError;

      // Create payment transaction record
      const { error: paymentError } = await supabase
        .from('payment_transactions')
        .insert({
          transaction_type: 'gift_voucher',
          reference_id: voucher.id,
          amount: parseInt(formData.amount),
          currency: 'KES',
          payment_method: 'mpesa',
          status: 'pending'
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Voucher Request Received!",
        description: "Please proceed with payment to complete your gift voucher purchase.",
      });

      // Open payment modal
      setCurrentVoucherId(voucher.id);
      setShowPaymentModal(true);

      // Reset form
      setFormData({
        senderName: "",
        recipientName: "",
        recipientPhone: "",
        message: "",
        amount: "",
        branch: ""
      });

    } catch (error) {
      console.error('Gift voucher error:', error);
      toast({
        title: "Voucher Request Failed",
        description: "There was an error processing your voucher. Please try again.",
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
          <h1 className="text-5xl font-bold text-gold mb-6">Gift a Voucher</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Share the gift of wellness. Perfect for birthdays, anniversaries, or just showing someone you care.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Gift Voucher Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-gold">Create Your Gift Voucher</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-coral mb-4">Your Information</h3>
                      <Label htmlFor="senderName" className="text-white">Your Name *</Label>
                      <Input
                        id="senderName"
                        value={formData.senderName}
                        onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    {/* Recipient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-coral">Recipient Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientName" className="text-white">Recipient Name *</Label>
                          <Input
                            id="recipientName"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="recipientPhone" className="text-white">Recipient Phone *</Label>
                          <Input
                            id="recipientPhone"
                            type="tel"
                            value={formData.recipientPhone}
                            onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="+254 7XX XXX XXX"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Voucher Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-coral">Voucher Details</h3>
                      
                      <div>
                        <Label className="text-white">Voucher Amount *</Label>
                        <Select value={formData.amount} onValueChange={(value) => setFormData({...formData, amount: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose amount" />
                          </SelectTrigger>
                          <SelectContent>
                            {voucherAmounts.map((amount) => (
                              <SelectItem key={amount.value} value={amount.value}>
                                {amount.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white">Redemption Branch *</Label>
                        <Select value={formData.branch} onValueChange={(value) => setFormData({...formData, branch: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="the-hub-karen">The Hub, Karen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-white">Personal Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Write a personal message for the recipient..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-coral hover:bg-coral/90 text-black font-semibold py-3"
                    >
                      {isSubmitting ? "Processing..." : "Purchase & Pay Now"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Voucher Preview */}
            <div>
              <Card className="bg-gradient-to-br from-coral to-gold text-black sticky top-24">
                <CardHeader className="text-center">
                  <Gift className="h-12 w-12 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Gift Voucher Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <img 
                      src="/lovable-uploads/e5598de2-23f3-4b89-8d22-bc28b1986003.png" 
                      alt="Priella Logo" 
                      className="h-16 w-16 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold mb-2">PRIELLA</h3>
                    <p className="text-sm">Massage Therapy Station</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>To:</strong> {formData.recipientName || "Recipient Name"}</p>
                    <p><strong>From:</strong> {formData.senderName || "Your Name"}</p>
                    <p><strong>Value:</strong> {formData.amount ? `Ksh ${formData.amount}` : "Select Amount"}</p>
                    <p><strong>Valid At:</strong> {formData.branch ? "The Hub, Karen" : "Select Branch"}</p>
                  </div>
                  
                  {formData.message && (
                    <div className="bg-black/20 rounded-lg p-3 mt-4">
                      <p className="text-sm italic">"{formData.message}"</p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs">
                    <p>Voucher Code: Will be generated</p>
                    <p>Valid for 12 months</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">How Gift Vouchers Work</h2>
            <p className="text-xl text-gray-300">Simple steps to give the perfect wellness gift</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Purchase",
                description: "Fill out the form and complete payment securely online"
              },
              {
                step: "2",
                title: "Deliver",
                description: "Voucher sent to recipient via SMS/email with unique code"
              },
              {
                step: "3",
                title: "Redeem",
                description: "Recipient books their session using the voucher code"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-coral text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && currentVoucherId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={parseInt(formData.amount) || 0}
          referenceId={currentVoucherId}
          transactionType="gift_voucher"
          description="Gift Voucher Purchase"
        />
      )}
    </div>
  );
};

export default GiftVoucher;
