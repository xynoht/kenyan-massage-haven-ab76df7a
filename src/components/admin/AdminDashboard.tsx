
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  MessageSquare, 
  Gift,
  LogOut,
  Settings,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminOverview from "./AdminOverview";
import AdminBookings from "./AdminBookings";
import AdminMessages from "./AdminMessages";
import AdminGiftVouchers from "./AdminGiftVouchers";
import AdminUsers from "./AdminUsers";

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
  const [activeTab, setActiveTab] = useState("overview");
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
    localStorage.removeItem('adminSession');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gold/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gold">Admin Dashboard</h1>
            <p className="text-gray-300">Welcome back, {adminData.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 capitalize">{adminData.role}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gold/20 text-gold hover:bg-gold hover:text-black"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-coral" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
                  <p className="text-xs text-orange-400">{stats.pendingBookings} pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">KSh {stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Messages</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
                  <p className="text-xs text-blue-400">{stats.newMessages} new</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Gift className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Gift Vouchers</p>
                  <p className="text-2xl font-bold text-white">{stats.totalVouchers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-coral data-[state=active]:text-black">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-coral data-[state=active]:text-black">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-coral data-[state=active]:text-black">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="data-[state=active]:bg-coral data-[state=active]:text-black">
              <Gift className="h-4 w-4 mr-2" />
              Vouchers
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-coral data-[state=active]:text-black">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview stats={stats} />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookings onStatsUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="messages">
            <AdminMessages onStatsUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="vouchers">
            <AdminGiftVouchers onStatsUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers adminData={adminData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
