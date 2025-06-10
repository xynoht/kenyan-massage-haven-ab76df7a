
import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          console.log('Found session data, logging in automatically');
          setAdminData(session);
          setIsAuthenticated(true);
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('adminSession');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (data: any) => {
    console.log('Login successful, setting admin data:', data);
    setAdminData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log('Logging out admin');
    localStorage.removeItem('adminSession');
    setAdminData(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard adminData={adminData} onLogout={handleLogout} />;
};

export default AdminDashboardPage;
