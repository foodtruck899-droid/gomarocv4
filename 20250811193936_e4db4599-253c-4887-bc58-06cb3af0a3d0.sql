-- Corriger la fonction get_current_user_role pour utiliser profiles.id au lieu de profiles.user_id
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  -- Pour les utilisateurs admin spécifiques, retourner directement 'admin'
  IF auth.uid()::text IN (
    SELECT id::text FROM auth.users WHERE email IN ('foodtruck899@gmail.com', 'foodtruck33800@gmail.com')
  ) THEN
    RETURN 'admin';
  END IF;
  
  -- Pour les autres utilisateurs, vérifier le rôle dans profiles
  RETURN COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'
  );
END;
$function$