
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  adminName: string;
  adminRole: string;
  onLogout: () => void;
}

const AdminHeader = ({ adminName, adminRole, onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gold/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gold">Admin Dashboard</h1>
          <p className="text-gray-300">Welcome back, {adminName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 capitalize">{adminRole}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-gold/20 text-gold hover:bg-gold hover:text-black"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
