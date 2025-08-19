-- Create function to get users with auth data
CREATE OR REPLACE FUNCTION public.get_users_with_auth_data()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Only allow admin users to call this function
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.user_id as id,
    p.full_name,
    au.email,
    au.email_confirmed_at,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.user_id
  ORDER BY p.created_at DESC;
END;
$$;