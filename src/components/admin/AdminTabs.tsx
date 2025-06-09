
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Gift,
  Users
} from "lucide-react";
import AdminOverview from "./AdminOverview";
import AdminBookings from "./AdminBookings";
import AdminMessages from "./AdminMessages";
import AdminGiftVouchers from "./AdminGiftVouchers";
import AdminUsers from "./AdminUsers";

interface StatsData {
  totalBookings: number;
  totalRevenue: number;
  totalMessages: number;
  totalVouchers: number;
  pendingBookings: number;
  newMessages: number;
}

interface AdminData {
  admin_id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface AdminTabsProps {
  stats: StatsData;
  adminData: AdminData;
  onStatsUpdate: () => void;
}

const AdminTabs = ({ stats, adminData, onStatsUpdate }: AdminTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
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
        <AdminBookings onStatsUpdate={onStatsUpdate} />
      </TabsContent>

      <TabsContent value="messages">
        <AdminMessages onStatsUpdate={onStatsUpdate} />
      </TabsContent>

      <TabsContent value="vouchers">
        <AdminGiftVouchers onStatsUpdate={onStatsUpdate} />
      </TabsContent>

      <TabsContent value="users">
        <AdminUsers adminData={adminData} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
