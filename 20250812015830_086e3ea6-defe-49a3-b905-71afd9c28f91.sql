-- Vérifier et corriger la fonction get_users_with_auth_data
-- D'abord, vérifier la structure exacte attendue
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'get_users_with_auth_data';

-- Recréer la fonction avec la bonne structure
DROP FUNCTION IF EXISTS public.get_users_with_auth_data();

CREATE OR REPLACE FUNCTION public.get_users_with_auth_data()
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  email_confirmed_at timestamp with time zone,
  role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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
    COALESCE(p.full_name, '')::text,
    COALESCE(au.email, '')::text,
    au.email_confirmed_at,
    p.role::text,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.id
  ORDER BY p.created_at DESC;
END;
$$;