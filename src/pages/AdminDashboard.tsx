
import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import InitialAdminSetup from "@/components/admin/InitialAdminSetup";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsInitialSetup, setNeedsInitialSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkInitialSetup();
  }, []);

  const checkInitialSetup = async () => {
    try {
      // Check if any admin users exist
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Error checking admin users:', error);
        // If there's an error accessing the table, assume setup is needed
        setNeedsInitialSetup(true);
      } else if (!adminUsers || adminUsers.length === 0) {
        console.log('No admin users found, initial setup required');
        setNeedsInitialSetup(true);
      } else {
        console.log('Admin users exist, checking session');
        checkSession();
      }
    } catch (error) {
      console.error('Error during initial setup check:', error);
      setNeedsInitialSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

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
    }
  };

  const handleSetupComplete = () => {
    console.log('Initial setup completed');
    setNeedsInitialSetup(false);
    toast({
      title: "Setup Complete",
      description: "You can now log in with your admin credentials.",
    });
  };

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

  if (needsInitialSetup) {
    return <InitialAdminSetup onSetupComplete={handleSetupComplete} />;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard adminData={adminData} onLogout={handleLogout} />;
};

export default AdminDashboardPage;
