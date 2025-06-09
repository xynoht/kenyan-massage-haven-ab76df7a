
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
      // Check if session is expired
      const expiresAt = new Date(sessionData.expiresAt);
      if (expiresAt <= new Date()) {
        console.log('Session expired');
        return false;
      }

      // Verify session token is still valid in database
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('admin_id, expires_at')
        .eq('session_token', sessionData.sessionToken)
        .eq('admin_id', sessionData.admin_id)
        .single();

      if (error || !data) {
        console.log('Session not found in database');
        return false;
      }

      // Check if database session is expired
      const dbExpiresAt = new Date(data.expires_at);
      if (dbExpiresAt <= new Date()) {
        console.log('Database session expired');
        return false;
      }

      // Verify admin is still active
      const { data: adminInfo, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active, name, email, role')
        .eq('id', sessionData.admin_id)
        .single();

      if (adminError || !adminInfo || !adminInfo.is_active) {
        console.log('Admin account not found or inactive');
        return false;
      }

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
          setIsLoading(false);
          return;
        }

        const session = JSON.parse(sessionData);
        const isValid = await validateSession(session);

        if (isValid) {
          setAdminData(session);
          setIsAuthenticated(true);
        } else {
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

    // Set up periodic session validation (every 5 minutes)
    const sessionInterval = setInterval(async () => {
      if (isAuthenticated && adminData) {
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
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(sessionInterval);
  }, [isAuthenticated, adminData, toast]);

  const handleLoginSuccess = (data: any) => {
    setAdminData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (adminData?.sessionToken) {
        // Invalidate session in database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', adminData.sessionToken);
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
