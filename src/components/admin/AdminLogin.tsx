
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  const MAX_LOGIN_ATTEMPTS = 3;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

  const validateInput = () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return false;
    }

    if (!email.includes('@') || email.length < 5) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const checkRateLimit = () => {
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    
    if (lastAttempt && attempts >= MAX_LOGIN_ATTEMPTS) {
      const timeDiff = Date.now() - parseInt(lastAttempt);
      if (timeDiff < BLOCK_DURATION) {
        const remainingTime = Math.ceil((BLOCK_DURATION - timeDiff) / 1000 / 60);
        setIsBlocked(true);
        toast({
          title: "Too Many Attempts",
          description: `Please wait ${remainingTime} minutes before trying again.`,
          variant: "destructive",
        });
        return false;
      } else {
        // Reset attempts after block duration
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
        setLoginAttempts(0);
        setIsBlocked(false);
      }
    }
    return true;
  };

  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    localStorage.setItem('lastLoginAttempt', Date.now().toString());

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      setIsBlocked(true);
      toast({
        title: "Account Temporarily Locked",
        description: "Too many failed attempts. Please wait 15 minutes before trying again.",
        variant: "destructive",
      });
    }
  };

  const createSimpleSession = (adminData: any) => {
    try {
      console.log('Creating simple session for admin:', adminData.admin_id);
      
      // Create a simple session with a longer expiration time
      const sessionData = {
        ...adminData,
        sessionToken: `session_${adminData.admin_id}_${Date.now()}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        ipAddress: 'client',
        userAgent: navigator.userAgent.substring(0, 100)
      };

      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      
      // Clear failed login attempts on successful login
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lastLoginAttempt');
      setLoginAttempts(0);
      setIsBlocked(false);

      console.log('Session created successfully');
      return sessionData;
    } catch (error) {
      console.error('Session creation error:', error);
      throw new Error('Failed to create session');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput() || !checkRateLimit()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to authenticate admin:', email);
      
      // Authenticate admin with enhanced validation
      const { data, error } = await supabase.rpc('authenticate_admin', {
        email_input: email.trim().toLowerCase(),
        password_input: password
      });

      if (error) {
        console.error('Authentication error:', error);
        handleFailedAttempt();
        toast({
          title: "Authentication Error",
          description: "An error occurred during authentication. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const adminData = data[0];
        console.log('Authentication successful for admin:', adminData.name);
        
        // Check if admin account is active
        if (!adminData.is_active) {
          toast({
            title: "Account Inactive",
            description: "Your admin account has been deactivated. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        // Create simple session (without database dependency for now)
        const sessionData = createSimpleSession(adminData);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${adminData.name}!`,
        });

        onLoginSuccess(sessionData);
      } else {
        handleFailedAttempt();
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      handleFailedAttempt();
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gold/20">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-coral mx-auto mb-4" />
          <CardTitle className="text-2xl text-gold">Admin Login</CardTitle>
          <p className="text-gray-300">Priella Massage Therapy Station</p>
          
          {isBlocked && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
              <span className="text-red-300 text-sm">Account temporarily locked</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="admin@priella.com"
                disabled={isBlocked}
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  placeholder="Enter your password"
                  disabled={isBlocked}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {loginAttempts > 0 && loginAttempts < MAX_LOGIN_ATTEMPTS && (
              <div className="text-sm text-orange-400">
                Warning: {MAX_LOGIN_ATTEMPTS - loginAttempts} attempts remaining
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading || isBlocked}
              className="w-full bg-coral hover:bg-coral/90 text-black font-semibold"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Default credentials for testing:</p>
            <p>Email: tochiuimaria@gmail.com</p>
            <p>Password: priella2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
