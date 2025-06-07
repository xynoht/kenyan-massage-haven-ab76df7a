
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Clock, Star } from "lucide-react";

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
      {/* Revenue Overview */}
      <Card className="bg-gray-800 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-green-400">KSh {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-gray-300">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-blue-400">
                {stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}
              </p>
              <p className="text-gray-300">Average Booking (KSh)</p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-coral">{stats.totalBookings}</p>
              <p className="text-gray-300">Total Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-300">Pending Bookings</span>
                <span className="text-orange-400 font-bold">{stats.pendingBookings}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-300">New Messages</span>
                <span className="text-blue-400 font-bold">{stats.newMessages}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-300">Active Vouchers</span>
                <span className="text-purple-400 font-bold">{stats.totalVouchers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Business Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-coral/20 to-gold/20 rounded-lg border border-coral/30">
                <h4 className="font-semibold text-coral mb-2">Peak Hours</h4>
                <p className="text-gray-300 text-sm">
                  Most bookings occur between 2:00 PM - 6:00 PM on weekdays.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-2">Popular Sessions</h4>
                <p className="text-gray-300 text-sm">
                  30-minute sessions are the most popular choice among customers.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-2">Customer Satisfaction</h4>
                <p className="text-gray-300 text-sm">
                  High repeat booking rate indicates excellent service quality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operating Hours */}
      <Card className="bg-gray-800 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Operating Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-coral mb-3">Business Hours</h4>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white font-semibold">Every day: 10:00 AM - 7:30 PM</p>
                <p className="text-gray-400 text-sm">(Including holidays)</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-coral mb-3">Location</h4>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white">The Hub Mall Karen</p>
                <p className="text-gray-400 text-sm">Upper Ground Floor</p>
                <p className="text-gray-400 text-sm">Behind Nairobi Sports House</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
