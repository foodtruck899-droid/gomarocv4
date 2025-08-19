-- Créer le profil admin pour l'utilisateur foodtruck899@gmail.com
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Admin', 'admin'
FROM auth.users 
WHERE email = 'foodtruck899@gmail.com'
AND id NOT IN (SELECT id FROM public.profiles);