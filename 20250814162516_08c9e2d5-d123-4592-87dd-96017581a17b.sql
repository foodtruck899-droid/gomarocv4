-- Créer du contenu pour toutes les pages manquantes

-- Page À propos (about) - section déjà existante mais vérifions si elle a assez de contenu
INSERT INTO site_content (section, key, value, content_type) VALUES
('about', 'title', 'À propos de Go Maroc', 'text'),
('about', 'hero_description', 'Go Maroc, votre partenaire de confiance pour voyager entre la France et le Maroc', 'textarea'),
('about', 'histoire_title', 'Notre histoire', 'text'),
('about', 'histoire_content', 'Depuis plusieurs années, Go Maroc accompagne les voyageurs dans leurs déplacements', 'textarea')
ON CONFLICT (section, key) DO NOTHING;

-- Page Contact
INSERT INTO site_content (section, key, value, content_type) VALUES
('contact', 'title', 'Contactez-nous', 'text'),
('contact', 'hero_description', 'Notre équipe est à votre disposition pour répondre à toutes vos questions', 'textarea'),
('contact', 'phone_title', 'Téléphone', 'text'),
('contact', 'phone_number', '+33 X XX XX XX XX', 'text'),
('contact', 'email_title', 'Email', 'text'),
('contact', 'email_address', 'contact@gomaroc.com', 'text'),
('contact', 'address_title', 'Adresse', 'text'),
('contact', 'address_content', 'Adresse de nos bureaux', 'textarea'),
('contact', 'hours_title', 'Horaires d''ouverture', 'text'),
('contact', 'hours_content', 'Lundi - Vendredi : 9h - 18h', 'textarea')
ON CONFLICT (section, key) DO NOTHING;

-- Page Carrières
INSERT INTO site_content (section, key, value, content_type) VALUES
('careers', 'title', 'Carrières', 'text'),
('careers', 'hero_description', 'Rejoignez l''équipe Go Maroc et participez à notre croissance', 'textarea'),
('careers', 'why_join_title', 'Pourquoi nous rejoindre ?', 'text'),
('careers', 'why_join_description', 'Une entreprise dynamique avec de belles perspectives d''évolution', 'textarea'),
('careers', 'positions_title', 'Postes disponibles', 'text'),
('careers', 'positions_description', 'Découvrez nos offres d''emploi actuelles', 'textarea'),
('careers', 'application_title', 'Comment postuler', 'text'),
('careers', 'application_description', 'Envoyez votre CV à recrutement@gomaroc.com', 'textarea');

-- Page Politique de confidentialité
INSERT INTO site_content (section, key, value, content_type) VALUES
('privacy-policy', 'title', 'Politique de confidentialité', 'text'),
('privacy-policy', 'last_updated', 'Dernière mise à jour : Janvier 2024', 'text'),
('privacy-policy', 'introduction', 'Cette politique explique comment nous collectons et utilisons vos données personnelles.', 'textarea'),
('privacy-policy', 'data_collection_title', '1. Collecte des données', 'text'),
('privacy-policy', 'data_collection_content', 'Types de données que nous collectons et pourquoi.', 'textarea'),
('privacy-policy', 'data_usage_title', '2. Utilisation des données', 'text'),
('privacy-policy', 'data_usage_content', 'Comment nous utilisons vos données personnelles.', 'textarea'),
('privacy-policy', 'data_sharing_title', '3. Partage des données', 'text'),
('privacy-policy', 'data_sharing_content', 'Dans quels cas nous partageons vos données.', 'textarea'),
('privacy-policy', 'rights_title', '4. Vos droits', 'text'),
('privacy-policy', 'rights_content', 'Vos droits concernant vos données personnelles.', 'textarea');

-- Page Cookies
INSERT INTO site_content (section, key, value, content_type) VALUES
('cookies', 'title', 'Gestion des cookies', 'text'),
('cookies', 'description', 'Comment nous utilisons les cookies sur notre site', 'textarea'),
('cookies', 'what_are_cookies_title', 'Qu''est-ce que les cookies ?', 'text'),
('cookies', 'what_are_cookies_content', 'Les cookies sont de petits fichiers stockés sur votre appareil.', 'textarea'),
('cookies', 'cookie_types_title', 'Types de cookies utilisés', 'text'),
('cookies', 'cookie_types_content', 'Cookies essentiels, de performance et de marketing.', 'textarea'),
('cookies', 'manage_cookies_title', 'Gérer vos préférences', 'text'),
('cookies', 'manage_cookies_content', 'Comment modifier vos préférences de cookies.', 'textarea');

-- Page Destinations
INSERT INTO site_content (section, key, value, content_type) VALUES
('destinations', 'title', 'Nos destinations', 'text'),
('destinations', 'hero_description', 'Découvrez toutes nos destinations en France et au Maroc', 'textarea'),
('destinations', 'france_title', 'Destinations en France', 'text'),
('destinations', 'france_description', 'Principales villes desservies en France', 'textarea'),
('destinations', 'morocco_title', 'Destinations au Maroc', 'text'),
('destinations', 'morocco_description', 'Principales villes desservies au Maroc', 'textarea');

-- Page Itinéraires populaires
INSERT INTO site_content (section, key, value, content_type) VALUES
('popular-routes', 'title', 'Itinéraires populaires', 'text'),
('popular-routes', 'hero_description', 'Nos trajets les plus demandés entre la France et le Maroc', 'textarea'),
('popular-routes', 'top_routes_title', 'Trajets les plus populaires', 'text'),
('popular-routes', 'top_routes_description', 'Découvrez nos liaisons les plus fréquentées', 'textarea');

-- Page Gares routières
INSERT INTO site_content (section, key, value, content_type) VALUES
('bus-stations', 'title', 'Gares routières', 'text'),
('bus-stations', 'hero_description', 'Toutes les informations sur nos gares de départ et d''arrivée', 'textarea'),
('bus-stations', 'stations_list_title', 'Liste des gares', 'text'),
('bus-stations', 'stations_list_description', 'Adresses et informations pratiques de nos gares', 'textarea');

-- Page Cartes cadeaux
INSERT INTO site_content (section, key, value, content_type) VALUES
('gift-cards', 'title', 'Cartes cadeaux', 'text'),
('gift-cards', 'hero_description', 'Offrez un voyage avec nos cartes cadeaux Go Maroc', 'textarea'),
('gift-cards', 'how_it_works_title', 'Comment ça marche', 'text'),
('gift-cards', 'how_it_works_description', 'Achetez, offrez et utilisez vos cartes cadeaux facilement', 'textarea'),
('gift-cards', 'purchase_title', 'Acheter une carte cadeau', 'text'),
('gift-cards', 'purchase_description', 'Choisissez le montant et personnalisez votre carte', 'textarea');

-- Page Marketing (section d'accueil)
INSERT INTO site_content (section, key, value, content_type) VALUES
('marketing', 'title', 'Pourquoi choisir Go Maroc ?', 'text'),
('marketing', 'subtitle', 'Le meilleur du transport entre la France et le Maroc', 'text'),
('marketing', 'feature1_title', 'Confort optimal', 'text'),
('marketing', 'feature1_description', 'Bus modernes et confortables pour un voyage agréable', 'textarea'),
('marketing', 'feature2_title', 'Sécurité garantie', 'text'),
('marketing', 'feature2_description', 'Conducteurs expérimentés et véhicules régulièrement contrôlés', 'textarea'),
('marketing', 'feature3_title', 'Prix compétitifs', 'text'),
('marketing', 'feature3_description', 'Les meilleurs tarifs du marché pour vos voyages', 'textarea')
ON CONFLICT (section, key) DO NOTHING;

-- Page Témoignages clients (section d'accueil)
INSERT INTO site_content (section, key, value, content_type) VALUES
('testimonials', 'section_title', 'Ce que disent nos clients', 'text'),
('testimonials', 'subtitle', 'Découvrez les avis de nos voyageurs', 'text')
ON CONFLICT (section, key) DO NOTHING;