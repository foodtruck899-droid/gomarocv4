-- Ajouter les données pour la gestion de l'ordre des sections de la page d'accueil
INSERT INTO site_content (section, key, value, content_type) VALUES
('page_order', 'hero_section', '{"order": 1, "name": "Section Hero", "enabled": true, "component": "HeroSection"}', 'section_order'),
('page_order', 'feature_section', '{"order": 2, "name": "Section Fonctionnalités", "enabled": true, "component": "FeatureSection"}', 'section_order'),
('page_order', 'stats_section', '{"order": 3, "name": "Section Statistiques", "enabled": true, "component": "StatsSection"}', 'section_order'),
('page_order', 'marketing_section', '{"order": 4, "name": "Pourquoi choisir Go Maroc", "enabled": true, "component": "MarketingSection"}', 'section_order'),
('page_order', 'popular_destinations', '{"order": 5, "name": "Destinations Populaires", "enabled": true, "component": "PopularDestinations"}', 'section_order'),
('page_order', 'customer_testimonials', '{"order": 6, "name": "Témoignages Clients", "enabled": true, "component": "CustomerTestimonials"}', 'section_order');