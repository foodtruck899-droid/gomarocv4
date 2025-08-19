-- Ajouter le contenu des statistiques à la table site_content
INSERT INTO public.site_content (section, key, value, content_type) VALUES
('stats', 'main_title', 'Premier choix de voyage pour 2+ millions de personnes en 2024.', 'text'),
('stats', 'destinations_number', '50+', 'text'),
('stats', 'destinations_label', 'Destinations', 'text'),
('stats', 'countries_number', '2', 'text'),
('stats', 'countries_label', 'Pays', 'text'),
('stats', 'clients_number', '2M+', 'text'),
('stats', 'clients_label', 'Clients satisfaits', 'text'),
('stats', 'year_number', '2024', 'text'),
('stats', 'year_label', 'Cette année', 'text')
ON CONFLICT (section, key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();