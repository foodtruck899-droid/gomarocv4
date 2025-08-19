-- Fix the get_users_with_auth_data function to resolve type mismatch
DROP FUNCTION IF EXISTS public.get_users_with_auth_data();

CREATE OR REPLACE FUNCTION public.get_users_with_auth_data()
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  email_confirmed_at timestamptz,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow admin users to call this function
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    au.email::text,  -- Explicit cast to text
    au.email_confirmed_at,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.id
  ORDER BY p.created_at DESC;
END;
$$;