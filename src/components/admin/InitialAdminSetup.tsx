
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, User, Eye, EyeOff } from "lucide-react";

interface InitialAdminSetupProps {
  onSetupComplete: () => void;
}

const InitialAdminSetup = ({ onSetupComplete }: InitialAdminSetupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setAdminData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!adminData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }

    if (!adminData.email.trim() || !adminData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (adminData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (adminData.password !== adminData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateAdmin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('Creating initial admin user...');
      
      const { data, error } = await supabase.rpc('create_admin_user', {
        email_input: adminData.email,
        password_input: adminData.password,
        name_input: adminData.name,
        role_input: 'super_admin'
      });

      if (error) {
        console.error('Error creating admin user:', error);
        throw error;
      }

      console.log('Admin user created successfully:', data);

      toast({
        title: "Setup Complete!",
        description: "Initial admin account has been created successfully.",
      });

      onSetupComplete();
    } catch (error: any) {
      console.error('Setup failed:', error);
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to create admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-800 border-gold/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-coral" />
          </div>
          <CardTitle className="text-2xl text-gold">Initial Admin Setup</CardTitle>
          <p className="text-gray-300 text-sm">
            Create your first admin account to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={adminData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={adminData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="admin@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={adminData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pr-10"
                placeholder="Enter password (min 8 characters)"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={adminData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Confirm your password"
              disabled={isLoading}
            />
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded text-sm">
            <p className="text-blue-200">
              <strong>Note:</strong> This will create a super admin account with full access to all system features.
            </p>
          </div>

          <Button
            onClick={handleCreateAdmin}
            disabled={isLoading}
            className="w-full bg-coral hover:bg-coral/90 text-black font-semibold"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Creating Admin Account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitialAdminSetup;
