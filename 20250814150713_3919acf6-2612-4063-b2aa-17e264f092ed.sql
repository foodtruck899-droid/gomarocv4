-- Créer un bucket pour stocker les images du site
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Créer les politiques RLS pour le bucket site-images
CREATE POLICY "Les admins peuvent voir toutes les images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'site-images');

CREATE POLICY "Les admins peuvent uploader des images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'site-images' AND (get_current_user_role() = 'admin'));

CREATE POLICY "Les admins peuvent modifier les images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'site-images' AND (get_current_user_role() = 'admin'));

CREATE POLICY "Les admins peuvent supprimer les images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'site-images' AND (get_current_user_role() = 'admin'));