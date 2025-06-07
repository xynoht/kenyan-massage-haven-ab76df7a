
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Shield, UserCheck, UserX, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

interface AdminData {
  admin_id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface AdminUsersProps {
  adminData: AdminData;
}

const AdminUsers = ({ adminData }: AdminUsersProps) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "admin",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load admin users.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  const addNewUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate password hash using SQL function
      const { data, error } = await supabase.rpc('sql', {
        sql: `
          INSERT INTO public.admin_users (email, password_hash, name, role) 
          VALUES ('${newUser.email}', crypt('${newUser.password}', gen_salt('bf')), '${newUser.name}', '${newUser.role}')
          RETURNING id, email, name, role, is_active, created_at;
        `
      });

      if (error) throw error;

      toast({
        title: "User Added",
        description: "New admin user created successfully.",
      });

      setNewUser({ email: "", name: "", role: "admin", password: "" });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add new user. Email might already exist.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-red-500 text-white">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500 text-white">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-green-500 text-white">Moderator</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-500 text-white">Active</Badge> :
      <Badge className="bg-red-500 text-white">Inactive</Badge>;
  };

  const canManageUser = (targetRole: string) => {
    // Super admins can manage everyone
    if (adminData.role === 'super_admin') return true;
    
    // Admins can manage moderators but not other admins or super admins
    if (adminData.role === 'admin' && targetRole === 'moderator') return true;
    
    return false;
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gold/20">
        <CardContent className="p-6">
          <div className="text-center text-gray-300">Loading admin users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add User Form */}
      {adminData.role === 'super_admin' && (
        <Card className="bg-gray-800 border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold flex items-center justify-between">
              <span className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add New Admin User
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
                className="border-coral text-coral hover:bg-coral hover:text-black"
              >
                {showAddForm ? 'Cancel' : 'Add User'}
              </Button>
            </CardTitle>
          </CardHeader>
          
          {showAddForm && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Full Name</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      {adminData.role === 'super_admin' && (
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                      placeholder="Enter password"
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
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={addNewUser}
                  className="bg-coral hover:bg-coral/90 text-black"
                >
                  Create User
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                {/* User Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-white">
                    <Shield className="h-4 w-4 mr-2 text-coral" />
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <div className="text-gray-300 text-sm">{user.email}</div>
                </div>

                {/* Role & Status */}
                <div className="space-y-2">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.is_active)}
                </div>

                {/* Login Info */}
                <div className="text-sm text-gray-400">
                  <div>Created: {format(new Date(user.created_at), 'MMM dd, yyyy')}</div>
                  {user.last_login_at && (
                    <div>Last login: {format(new Date(user.last_login_at), 'MMM dd, HH:mm')}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {canManageUser(user.role) && user.id !== adminData.admin_id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={user.is_active ? 
                        "border-red-500 text-red-500 hover:bg-red-500 hover:text-white" :
                        "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      }
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  )}
                  
                  {user.id === adminData.admin_id && (
                    <Badge variant="outline" className="border-gold text-gold">
                      You
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
