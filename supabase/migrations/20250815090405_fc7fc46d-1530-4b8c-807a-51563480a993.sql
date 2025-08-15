-- Add RLS policies for admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to view admin users (for session validation)
CREATE POLICY "Admin users can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.id::text = auth.uid()::text 
    AND au.is_active = true
  ) OR auth.uid() IS NULL -- Allow during authentication
);

-- Prevent any updates/inserts/deletes (admin users are fixed)
CREATE POLICY "No modifications allowed" 
ON public.admin_users 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Add RLS policies for admin_sessions table  
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to manage their own sessions
CREATE POLICY "Admin users can manage own sessions" 
ON public.admin_sessions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.id = admin_id 
    AND au.id::text = auth.uid()::text 
    AND au.is_active = true
  )
);

-- Add RLS policies for admin_analytics table
ALTER TABLE public.admin_analytics ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to view analytics
CREATE POLICY "Admin users can view analytics" 
ON public.admin_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.id::text = auth.uid()::text 
    AND au.is_active = true
  )
);