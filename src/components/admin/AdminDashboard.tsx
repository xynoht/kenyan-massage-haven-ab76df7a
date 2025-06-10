import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "./AdminHeader";
import AdminStatsCards from "./AdminStatsCards";
import AdminTabs from "./AdminTabs";

interface AdminData {
  admin_id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface AdminDashboardProps {
  adminData: AdminData;
  onLogout: () => void;
}

const AdminDashboard = ({ adminData, onLogout }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalMessages: 0,
    totalVouchers: 0,
    pendingBookings: 0,
    newMessages: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch bookings stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('status, total_amount');

      if (bookingsError) throw bookingsError;

      // Fetch messages stats
      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('status');

      if (messagesError) throw messagesError;

      // Fetch gift vouchers stats
      const { data: vouchers, error: vouchersError } = await supabase
        .from('gift_vouchers')
        .select('amount, status');

      if (vouchersError) throw vouchersError;

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      const totalMessages = messages?.length || 0;
      const totalVouchers = vouchers?.length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const newMessages = messages?.filter(m => m.status === 'new').length || 0;

      setStats({
        totalBookings,
        totalRevenue,
        totalMessages,
        totalVouchers,
        pendingBookings,
        newMessages
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader 
        adminName={adminData.name}
        adminRole={adminData.role}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto p-6">
        <AdminStatsCards stats={stats} />
        <AdminTabs 
          stats={stats} 
          adminData={adminData} 
          onStatsUpdate={fetchStats} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
