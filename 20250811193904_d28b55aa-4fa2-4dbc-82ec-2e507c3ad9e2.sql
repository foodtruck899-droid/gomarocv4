-- Corriger la fonction get_users_with_auth_data pour utiliser profiles.id au lieu de profiles.user_id
CREATE OR REPLACE FUNCTION public.get_users_with_auth_data()
 RETURNS TABLE(id uuid, full_name text, email text, email_confirmed_at timestamp with time zone, role text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
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
    au.email,
    au.email_confirmed_at,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.id
  ORDER BY p.created_at DESC;
END;
$function$