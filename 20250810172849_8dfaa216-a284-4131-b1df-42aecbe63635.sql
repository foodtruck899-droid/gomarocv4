-- Créer une table pour stocker tous les contenus personnalisables du site
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- ex: 'hero', 'features', 'footer', etc.
  key TEXT NOT NULL, -- ex: 'title', 'subtitle', 'description', etc.
  value TEXT, -- Le contenu personnalisable
  content_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'html', 'image_url', 'number'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Politiques RLS : tout le monde peut lire, seuls les admins peuvent modifier
CREATE POLICY "Tout le monde peut voir le contenu du site" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Seuls les admins peuvent modifier le contenu" ON public.site_content
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Insérer les contenus par défaut de la page d'accueil
INSERT INTO public.site_content (section, key, value, content_type) VALUES
-- Section Hero
('hero', 'title', 'Voyagez avec Go Maroc', 'text'),
('hero', 'subtitle', 'Des trajets confortables et sûrs entre le Maroc et l''Europe', 'text'),
('hero', 'description', 'Réservez votre voyage en bus facilement et profitez d''un service de qualité pour vos déplacements entre le Maroc et l''Europe.', 'text'),
('hero', 'cta_button', 'Réserver maintenant', 'text'),

-- Section Features
('features', 'title', 'Pourquoi choisir Go Maroc ?', 'text'),
('features', 'feature1_title', 'Confort Premium', 'text'),
('features', 'feature1_description', 'Bus modernes avec climatisation, sièges inclinables et espace pour les jambes', 'text'),
('features', 'feature2_title', 'Sécurité Garantie', 'text'),
('features', 'feature2_description', 'Conducteurs expérimentés et véhicules régulièrement contrôlés', 'text'),
('features', 'feature3_title', 'Prix Compétitifs', 'text'),
('features', 'feature3_description', 'Les meilleurs tarifs pour vos voyages entre le Maroc et l''Europe', 'text'),

-- Section Stats
('stats', 'title', 'Go Maroc en chiffres', 'text'),
('stats', 'passengers_label', 'Passagers satisfaits', 'text'),
('stats', 'passengers_count', '50000', 'number'),
('stats', 'routes_label', 'Routes disponibles', 'text'),
('stats', 'routes_count', '25', 'number'),
('stats', 'experience_label', 'Années d''expérience', 'text'),
('stats', 'experience_count', '15', 'number'),
('stats', 'satisfaction_label', 'Taux de satisfaction', 'text'),
('stats', 'satisfaction_count', '98', 'number'),

-- Section Footer
('footer', 'company_description', 'Go Maroc est votre partenaire de confiance pour tous vos voyages en bus entre le Maroc et l''Europe.', 'text'),
('footer', 'contact_title', 'Contact', 'text'),
('footer', 'contact_phone', '+33 1 23 45 67 89', 'text'),
('footer', 'contact_email', 'contact@gomaroc.com', 'text'),
('footer', 'address', '123 Rue de la Paix, 75001 Paris, France', 'text'),

-- Métadonnées SEO
('seo', 'meta_title', 'Go Maroc - Voyages en bus Maroc Europe | Réservation en ligne', 'text'),
('seo', 'meta_description', 'Réservez votre voyage en bus entre le Maroc et l''Europe avec Go Maroc. Service de qualité, prix compétitifs et confort garanti.', 'text'),
('seo', 'meta_keywords', 'bus maroc europe, voyage maroc france, transport maroc, réservation bus', 'text');

-- Trigger pour updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();