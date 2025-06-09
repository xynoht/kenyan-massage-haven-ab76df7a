
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, MessageSquare, Gift } from "lucide-react";

interface StatsData {
  totalBookings: number;
  totalRevenue: number;
  totalMessages: number;
  totalVouchers: number;
  pendingBookings: number;
  newMessages: number;
}

interface AdminStatsCardsProps {
  stats: StatsData;
}

const AdminStatsCards = ({ stats }: AdminStatsCardsProps) => {
  return (
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
  );
};

export default AdminStatsCards;
