-- Supprimer toutes les politiques existantes sur la table profiles
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;  
DROP POLICY IF EXISTS "Admins peuvent voir tous les profils" ON public.profiles;

-- Créer une fonction sécurisée pour vérifier le rôle admin
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Pour l'utilisateur spécifique admin, retourner directement 'admin'
  IF auth.uid()::text = (SELECT id::text FROM auth.users WHERE email = 'foodtruck33800@gmail.com' LIMIT 1) THEN
    RETURN 'admin';
  END IF;
  
  -- Pour les autres utilisateurs, retourner 'user'
  RETURN 'user';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recréer les politiques sans récursion
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.get_current_user_role() = 'admin');