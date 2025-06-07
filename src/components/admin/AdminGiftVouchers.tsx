
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, User, MapPin, Clock, DollarSign, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface GiftVoucher {
  id: string;
  voucher_code: string;
  sender_name: string;
  recipient_name: string;
  recipient_phone: string;
  amount: number;
  branch: string;
  message: string;
  status: string;
  payment_status: string;
  created_at: string;
  expires_at: string;
}

interface AdminGiftVouchersProps {
  onStatsUpdate: () => void;
}

const AdminGiftVouchers = ({ onStatsUpdate }: AdminGiftVouchersProps) => {
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast({
        title: "Error",
        description: "Failed to load gift vouchers.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateVoucherStatus = async (voucherId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('gift_vouchers')
        .update({ status: newStatus })
        .eq('id', voucherId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Voucher status changed to ${newStatus}.`,
      });

      fetchVouchers();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating voucher status:', error);
      toast({
        title: "Error",
        description: "Failed to update voucher status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'redeemed':
        return <Badge className="bg-blue-500 text-white">Redeemed</Badge>;
      case 'expired':
        return <Badge className="bg-red-500 text-white">Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500 text-white">Cancelled</Badge>;
      default:
        return <Badge className="bg-orange-500 text-white">Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Paid</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Pending Payment</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gold/20">
        <CardContent className="p-6">
          <div className="text-center text-gray-300">Loading gift vouchers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {vouchers.length === 0 ? (
        <Card className="bg-gray-800 border-gold/20">
          <CardContent className="p-6 text-center">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">No gift vouchers found.</p>
          </CardContent>
        </Card>
      ) : (
        vouchers.map((voucher) => (
          <Card key={voucher.id} className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Voucher Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-coral font-mono font-bold">
                    <Gift className="h-4 w-4 mr-2" />
                    {voucher.voucher_code}
                  </div>
                  <div className="text-green-400 font-semibold">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    KSh {voucher.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {voucher.branch}
                  </div>
                </div>

                {/* Sender & Recipient */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400">From:</p>
                    <p className="text-white font-semibold">{voucher.sender_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">To:</p>
                    <p className="text-white">{voucher.recipient_name}</p>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      {voucher.recipient_phone}
                    </div>
                  </div>
                </div>

                {/* Dates & Status */}
                <div className="space-y-2">
                  <div>
                    {getStatusBadge(voucher.status)}
                  </div>
                  <div>
                    {getPaymentStatusBadge(voucher.payment_status)}
                  </div>
                  <div className="text-xs text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Created: {format(new Date(voucher.created_at), 'MMM dd, yyyy')}
                    </div>
                    <div className="mt-1">
                      Expires: {format(new Date(voucher.expires_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  {voucher.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateVoucherStatus(voucher.id, 'redeemed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Mark Redeemed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateVoucherStatus(voucher.id, 'cancelled')}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    onClick={() => window.open(`https://wa.me/${voucher.recipient_phone.replace(/[^0-9]/g, '')}`)}
                  >
                    Contact Recipient
                  </Button>
                </div>
              </div>

              {voucher.message && (
                <div className="mt-4 p-3 bg-gray-700 rounded">
                  <p className="text-sm text-gray-300">
                    <strong>Message:</strong> {voucher.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminGiftVouchers;
