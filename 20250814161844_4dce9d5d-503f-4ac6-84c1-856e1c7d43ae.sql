-- Créer du contenu par défaut pour les pages manquantes

-- Page Mentions légales
INSERT INTO site_content (section, key, value, content_type) VALUES
('legal-mentions', 'title', 'Mentions légales', 'text'),
('legal-mentions', 'description', 'Mentions légales de Go Maroc - Service de transport par autocar', 'text'),
('legal-mentions', 'company_name', 'Go Maroc SARL', 'text'),
('legal-mentions', 'company_address', 'Adresse de la société Go Maroc', 'textarea'),
('legal-mentions', 'company_phone', '+33 X XX XX XX XX', 'text'),
('legal-mentions', 'company_email', 'contact@gomaroc.com', 'text'),
('legal-mentions', 'legal_content', 'Contenu des mentions légales à personnaliser', 'textarea');

-- Page Transport de bagages
INSERT INTO site_content (section, key, value, content_type) VALUES
('bagages', 'title', 'Transport de bagages', 'text'),
('bagages', 'hero_description', 'Voyagez en toute sérénité avec nos services de transport de bagages', 'textarea'),
('bagages', 'weight_limit_title', 'Limites de poids', 'text'),
('bagages', 'weight_limit_description', 'Chaque passager peut transporter gratuitement 1 bagage de 20kg maximum', 'textarea'),
('bagages', 'excess_baggage_title', 'Bagages supplémentaires', 'text'),
('bagages', 'excess_baggage_description', 'Tarifs et conditions pour les bagages supplémentaires', 'textarea'),
('bagages', 'prohibited_items_title', 'Objets interdits', 'text'),
('bagages', 'prohibited_items_description', 'Liste des objets interdits dans les bagages', 'textarea');

-- Page Assistance passagers
INSERT INTO site_content (section, key, value, content_type) VALUES
('assistance', 'title', 'Assistance passagers', 'text'),
('assistance', 'hero_description', 'Notre équipe est là pour vous accompagner tout au long de votre voyage', 'textarea'),
('assistance', 'pmr_title', 'Passagers à mobilité réduite', 'text'),
('assistance', 'pmr_description', 'Services spécialisés pour les passagers à mobilité réduite', 'textarea'),
('assistance', 'contact_title', 'Nous contacter', 'text'),
('assistance', 'contact_description', 'Comment nous joindre en cas de besoin', 'textarea');

-- Page Services premium
INSERT INTO site_content (section, key, value, content_type) VALUES
('premium', 'title', 'Services premium', 'text'),
('premium', 'hero_description', 'Découvrez nos services premium pour un voyage d''exception', 'textarea'),
('premium', 'comfort_title', 'Confort supérieur', 'text'),
('premium', 'comfort_description', 'Sièges premium avec plus d''espace et de confort', 'textarea'),
('premium', 'priority_title', 'Embarquement prioritaire', 'text'),
('premium', 'priority_description', 'Montez en premier et choisissez votre place', 'textarea');

-- Page Routes
INSERT INTO site_content (section, key, value, content_type) VALUES
('routes', 'title', 'Rechercher un trajet', 'text'),
('routes', 'hero_description', 'Trouvez le trajet parfait pour votre voyage', 'textarea'),
('routes', 'search_title', 'Recherche de trajets', 'text'),
('routes', 'search_description', 'Utilisez notre moteur de recherche pour trouver vos trajets', 'textarea');

-- Page Schedules
INSERT INTO site_content (section, key, value, content_type) VALUES
('schedules', 'title', 'Horaires & Tarifs', 'text'),
('schedules', 'hero_description', 'Consultez nos horaires et tarifs pour tous nos trajets', 'textarea'),
('schedules', 'timetable_title', 'Horaires', 'text'),
('schedules', 'timetable_description', 'Horaires détaillés de tous nos départs', 'textarea'),
('schedules', 'pricing_title', 'Tarifs', 'text'),
('schedules', 'pricing_description', 'Grille tarifaire de nos services', 'textarea');