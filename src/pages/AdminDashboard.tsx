import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const validateSession = async (sessionData: any) => {
    try {
      console.log('Validating session for admin:', sessionData.admin_id);
      
      // Check if session is expired (client-side check)
      const expiresAt = new Date(sessionData.expiresAt);
      if (expiresAt <= new Date()) {
        console.log('Session expired (client-side)');
        return false;
      }

      // Verify admin is still active (simplified check)
      const { data: adminInfo, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active, name, email, role')
        .eq('id', sessionData.admin_id)
        .single();

      if (adminError) {
        console.error('Error fetching admin info:', adminError);
        return false;
      }

      if (!adminInfo || !adminInfo.is_active) {
        console.log('Admin account not found or inactive');
        return false;
      }

      console.log('Session validation successful');
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const clearSession = () => {
    localStorage.removeItem('adminSession');
    setAdminData(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) {
          console.log('No session found in localStorage');
          setIsLoading(false);
          return;
        }

        const session = JSON.parse(sessionData);
        console.log('Found session data:', { admin_id: session.admin_id, expiresAt: session.expiresAt });
        
        const isValid = await validateSession(session);

        if (isValid) {
          console.log('Session is valid, setting authenticated state');
          setAdminData(session);
          setIsAuthenticated(true);
        } else {
          console.log('Session is invalid, clearing session');
          clearSession();
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up periodic session validation (every 10 minutes instead of 5)
    const sessionInterval = setInterval(async () => {
      if (isAuthenticated && adminData) {
        console.log('Performing periodic session validation');
        const isValid = await validateSession(adminData);
        if (!isValid) {
          clearSession();
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(sessionInterval);
  }, [isAuthenticated, adminData, toast]);

  const handleLoginSuccess = (data: any) => {
    console.log('Login successful, setting admin data:', data);
    setAdminData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out admin');
      if (adminData?.sessionToken) {
        // Try to invalidate session in database, but don't fail if it doesn't work
        const { error } = await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', adminData.sessionToken);
        
        if (error) {
          console.log('Note: Could not invalidate session in database:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
          <span>Validating session...</span>
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
