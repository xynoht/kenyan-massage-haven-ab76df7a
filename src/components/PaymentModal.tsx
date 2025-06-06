
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const paybillNumber = "880100";
  const accountNumber = "8504260017";

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Instructions
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
              <h3 className="font-semibold text-green-800 mb-3">M-Pesa Paybill Payment</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded p-3">
                  <div>
                    <p className="text-sm text-gray-600">Paybill Number</p>
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
                    <strong>Reference:</strong> {referenceId}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please include this reference when making payment
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-green-700">
                <h4 className="font-semibold mb-2">Payment Steps:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to M-Pesa menu</li>
                  <li>Select "Lipa na M-Pesa"</li>
                  <li>Select "Pay Bill"</li>
                  <li>Enter Paybill Number: <strong>{paybillNumber}</strong></li>
                  <li>Enter Account Number: <strong>{accountNumber}</strong></li>
                  <li>Enter Amount: <strong>KSh {amount.toLocaleString()}</strong></li>
                  <li>Enter your M-Pesa PIN</li>
                  <li>Confirm payment</li>
                </ol>
                
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>Important:</strong> After payment, please contact us at +254 123 456 789 
                    with your M-Pesa reference and booking ID ({referenceId}) to confirm your payment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
