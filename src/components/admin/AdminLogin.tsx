
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
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
  const { toast } = useToast();

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

  const createSimpleSession = (adminData: any) => {
    try {
      console.log('Creating simple session for admin:', adminData.admin_id);
      
      const sessionData = {
        ...adminData,
        sessionToken: `session_${adminData.admin_id}_${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      
      console.log('Session created successfully');
      return sessionData;
    } catch (error) {
      console.error('Session creation error:', error);
      throw new Error('Failed to create session');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to authenticate admin:', email);
      
      const { data, error } = await supabase.rpc('authenticate_admin', {
        email_input: email.trim().toLowerCase(),
        password_input: password
      });

      if (error) {
        console.error('Authentication error:', error);
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
        
        if (!adminData.is_active) {
          toast({
            title: "Account Inactive",
            description: "Your admin account has been deactivated. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        const sessionData = createSimpleSession(adminData);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${adminData.name}!`,
        });

        onLoginSuccess(sessionData);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
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
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
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
