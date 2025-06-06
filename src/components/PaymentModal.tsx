
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CreditCard, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  referenceId: string;
  transactionType: 'booking' | 'gift_voucher';
  description: string;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  referenceId, 
  transactionType, 
  description 
}: PaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your M-Pesa phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: phoneNumber,
          amount: amount,
          reference_id: referenceId,
          transaction_type: transactionType
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Payment Request Sent",
          description: "Please check your phone for the M-Pesa payment prompt.",
        });
        
        // Start polling for payment status
        pollPaymentStatus(data.checkout_request_id);
      } else {
        throw new Error(data.error || 'Payment request failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from('mpesa_transactions')
          .select('status, result_code')
          .eq('checkout_request_id', checkoutRequestId)
          .single();

        if (error) throw error;

        if (data.status === 'completed') {
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully!",
          });
          onClose();
          return;
        } else if (data.status === 'failed') {
          toast({
            title: "Payment Failed",
            description: "Your payment was not successful. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Continue polling if still pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          toast({
            title: "Payment Timeout",
            description: "Payment verification timed out. Please check your transaction status.",
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    };

    // Start polling after 5 seconds
    setTimeout(poll, 5000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as Kenya phone number
    if (digits.length <= 10) {
      return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return digits.substring(0, 10).replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-none shadow-none">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="text-lg">{description}</CardTitle>
            <div className="text-2xl font-bold text-coral">
              KSh {amount.toLocaleString()}
            </div>
          </CardHeader>
          
          <CardContent className="px-0 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">M-Pesa Payment</span>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Pay securely using your M-Pesa mobile money account
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    M-Pesa Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="mt-1"
                    maxLength={12}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the phone number registered with M-Pesa
                  </p>
                </div>
                
                <Button 
                  onClick={handleMpesaPayment}
                  disabled={isProcessing || !phoneNumber}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay KSh ${amount.toLocaleString()} via M-Pesa`
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
