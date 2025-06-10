
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign,
  BarChart3,
  ArrowRight
} from "lucide-react";
import AdminAnalytics from "./AdminAnalytics";
import TestDataManager from "./TestDataManager";
import SiteHealthReport from "./SiteHealthReport";

interface AdminOverviewProps {
  stats: {
    totalBookings: number;
    totalRevenue: number;
    totalMessages: number;
    totalVouchers: number;
    pendingBookings: number;
    newMessages: number;
  };
}

const AdminOverview = ({ stats }: AdminOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Site Health Report */}
      <SiteHealthReport />

      {/* Test Data Manager */}
      <TestDataManager />

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-xs text-green-400">
                  Avg: KSh {stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
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
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Gift Vouchers</p>
                <p className="text-2xl font-bold text-white">{stats.totalVouchers}</p>
                <p className="text-xs text-purple-400">Active vouchers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card className="bg-gray-800 border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-coral" />
              <CardTitle className="text-gold">Analytics Dashboard</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdminAnalytics />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
