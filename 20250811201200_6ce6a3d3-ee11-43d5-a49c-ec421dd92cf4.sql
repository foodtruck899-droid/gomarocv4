-- Ajouter le contenu pour le bas de page (footer)
INSERT INTO public.site_content (section, key, value, content_type) VALUES
-- Section Entreprise
('footer', 'section_company_title', 'Entreprise', 'text'),
('footer', 'company_about', 'À propos de Go Maroc', 'text'),
('footer', 'company_about_url', '/about', 'text'),
('footer', 'company_careers', 'Carrières', 'text'),
('footer', 'company_careers_url', '/careers', 'text'),
('footer', 'company_press', 'Presse', 'text'),
('footer', 'company_press_url', '/press', 'text'),
('footer', 'company_giftcards', 'Cartes cadeaux', 'text'),
('footer', 'company_giftcards_url', '/gift-cards', 'text'),

-- Section Voyage
('footer', 'section_travel_title', 'Voyage', 'text'),
('footer', 'travel_routes', 'Itinéraires populaires', 'text'),
('footer', 'travel_routes_url', '/popular-routes', 'text'),
('footer', 'travel_stations', 'Gares routières', 'text'),
('footer', 'travel_stations_url', '/bus-stations', 'text'),
('footer', 'travel_app', 'App Go Maroc', 'text'),
('footer', 'travel_app_url', '#', 'text'),
('footer', 'travel_groups', 'Voyages de groupe', 'text'),
('footer', 'travel_groups_url', '#', 'text'),

-- Section Service
('footer', 'section_service_title', 'Service', 'text'),
('footer', 'service_help', 'Centre d''aide', 'text'),
('footer', 'service_help_url', '#', 'text'),
('footer', 'service_booking', 'Gérer ma réservation', 'text'),
('footer', 'service_booking_url', '#', 'text'),
('footer', 'service_tracking', 'Suivi de voyage', 'text'),
('footer', 'service_tracking_url', '#', 'text'),
('footer', 'service_contact', 'Nous contacter', 'text'),
('footer', 'service_contact_url', '#', 'text'),

-- Section Légal
('footer', 'section_legal_title', 'Légal', 'text'),
('footer', 'legal_terms', 'Conditions générales', 'text'),
('footer', 'legal_terms_url', '/terms', 'text'),
('footer', 'legal_privacy', 'Politique de confidentialité', 'text'),
('footer', 'legal_privacy_url', '#', 'text'),
('footer', 'legal_mentions', 'Mentions légales', 'text'),
('footer', 'legal_mentions_url', '#', 'text'),
('footer', 'legal_cookies', 'Gestion des cookies', 'text'),
('footer', 'legal_cookies_url', '#', 'text'),

-- Copyright
('footer', 'copyright', '© 2024 Go Maroc. Tous droits réservés.', 'text')

ON CONFLICT (section, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();