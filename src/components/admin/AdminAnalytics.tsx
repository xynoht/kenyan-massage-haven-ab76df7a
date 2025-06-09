
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { CalendarDays, TrendingUp, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsSummary {
  total_bookings: number;
  total_revenue: number;
  avg_booking_value: number;
  unique_customers: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  growth_rate: number;
}

interface BookingAnalytics {
  date: string;
  total_bookings: number;
  total_revenue: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  avg_booking_value: number;
  unique_customers: number;
}

interface MonthlyTrends {
  month: string;
  bookings_count: number;
  revenue: number;
  avg_booking_value: number;
  unique_customers: number;
}

interface BranchPerformance {
  branch: string;
  total_bookings: number;
  total_revenue: number;
  avg_booking_value: number;
  unique_customers: number;
  booking_percentage: number;
}

interface ServiceDurationAnalytics {
  duration: number;
  booking_count: number;
  total_revenue: number;
  avg_revenue_per_booking: number;
  percentage: number;
}

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

const AdminAnalytics = () => {
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [bookingAnalytics, setBookingAnalytics] = useState<BookingAnalytics[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrends[]>([]);
  const [branchPerformance, setBranchPerformance] = useState<BranchPerformance[]>([]);
  const [serviceDuration, setServiceDuration] = useState<ServiceDurationAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Fetch analytics summary
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_analytics_summary');

      if (summaryError) throw summaryError;
      if (summaryData && summaryData.length > 0) {
        setAnalyticsSummary(summaryData[0]);
      }

      // Fetch booking analytics (last 30 days)
      const { data: bookingData, error: bookingError } = await supabase
        .from('booking_analytics')
        .select('*')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: true });

      if (bookingError) throw bookingError;
      setBookingAnalytics(bookingData || []);

      // Fetch monthly trends
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('monthly_revenue_trends')
        .select('*')
        .limit(12);

      if (monthlyError) throw monthlyError;
      setMonthlyTrends(monthlyData || []);

      // Fetch branch performance
      const { data: branchData, error: branchError } = await supabase
        .from('branch_performance')
        .select('*');

      if (branchError) throw branchError;
      setBranchPerformance(branchData || []);

      // Fetch service duration analytics
      const { data: durationData, error: durationError } = await supabase
        .from('service_duration_analytics')
        .select('*');

      if (durationError) throw durationError;
      setServiceDuration(durationData || []);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `KSh ${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
        <span className="ml-2 text-white">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {analyticsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarDays className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{analyticsSummary.total_bookings}</p>
                  <p className="text-xs text-green-400">
                    {analyticsSummary.growth_rate > 0 ? '+' : ''}{analyticsSummary.growth_rate}% from last period
                  </p>
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
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(analyticsSummary.total_revenue)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Avg: {formatCurrency(analyticsSummary.avg_booking_value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Unique Customers</p>
                  <p className="text-2xl font-bold text-white">{analyticsSummary.unique_customers}</p>
                  <p className="text-xs text-purple-400">
                    {analyticsSummary.confirmed_bookings} confirmed bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {analyticsSummary.total_bookings > 0 
                      ? Math.round((analyticsSummary.confirmed_bookings / analyticsSummary.total_bookings) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-orange-400">
                    {analyticsSummary.pending_bookings} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="trends" className="data-[state=active]:bg-coral data-[state=active]:text-black">
            Booking Trends
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-coral data-[state=active]:text-black">
            Revenue Analysis
          </TabsTrigger>
          <TabsTrigger value="branches" className="data-[state=active]:bg-coral data-[state=active]:text-black">
            Branch Performance
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-coral data-[state=active]:text-black">
            Service Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card className="bg-gray-800 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Daily Booking Trends (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={bookingAnalytics.map(item => ({
                  ...item,
                  date: formatDate(item.date)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #D97706',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total_bookings" 
                    stroke="#ff6b6b" 
                    strokeWidth={2}
                    name="Total Bookings"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confirmed_bookings" 
                    stroke="#4ecdc4" 
                    strokeWidth={2}
                    name="Confirmed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pending_bookings" 
                    stroke="#feca57" 
                    strokeWidth={2}
                    name="Pending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="bg-gray-800 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Monthly Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyTrends.map(item => ({
                  ...item,
                  month: formatMonth(item.month)
                })).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #D97706',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4ecdc4" name="Revenue" />
                  <Bar dataKey="bookings_count" fill="#ff6b6b" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold">Branch Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={branchPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="branch" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #D97706',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                    />
                    <Bar dataKey="total_revenue" fill="#45b7d1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold">Booking Distribution by Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={branchPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ branch, booking_percentage }) => `${branch}: ${booking_percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total_bookings"
                    >
                      {branchPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #D97706',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card className="bg-gray-800 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Service Duration Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={serviceDuration}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="duration" 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${value} min`}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #D97706',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      name === 'total_revenue' ? formatCurrency(Number(value)) : value,
                      name === 'total_revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="booking_count" fill="#96ceb4" name="Bookings" />
                  <Bar dataKey="total_revenue" fill="#feca57" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
