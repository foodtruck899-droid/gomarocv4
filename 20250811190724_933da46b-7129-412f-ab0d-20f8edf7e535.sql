-- Vérifier s'il y a déjà un utilisateur avec cet email et le supprimer si nécessaire
-- puis créer le compte admin

-- D'abord, supprimer le profil existant s'il existe
DELETE FROM public.profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'foodtruck899@gmail.com'
);

-- Ensuite, mettre à jour la fonction pour reconnaître le nouvel admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'foodtruck899@gmail.com' THEN 'admin'
      WHEN NEW.email = 'foodtruck33800@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

-- Mettre à jour la fonction de récupération du rôle
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  -- Pour les utilisateurs admin spécifiques, retourner directement 'admin'
  IF auth.uid()::text IN (
    SELECT id::text FROM auth.users WHERE email IN ('foodtruck899@gmail.com', 'foodtruck33800@gmail.com')
  ) THEN
    RETURN 'admin';
  END IF;
  
  -- Pour les autres utilisateurs, retourner 'user'
  RETURN 'user';
END;
$$;