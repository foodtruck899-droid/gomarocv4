-- Insérer le contenu initial pour les textes du header et des sections
INSERT INTO public.site_content (section, key, value, content_type) VALUES
-- Section Header / Menu
('header', 'organize_trip', 'Organisez votre voyage', 'text'),
('header', 'organize_trip_search', 'Rechercher un trajet', 'text'),
('header', 'organize_trip_schedules', 'Horaires & Tarifs', 'text'),
('header', 'organize_trip_destinations', 'Destinations populaires', 'text'),

-- Section Services
('header', 'services', 'Services', 'text'),
('header', 'services_baggage', 'Transport de bagages', 'text'),
('header', 'services_assistance', 'Assistance passagers', 'text'),
('header', 'services_premium', 'Services premium', 'text'),

-- Section Tracking
('header', 'track_journey', 'Suivez un trajet', 'text'),

-- Section Aide
('header', 'help', 'Aide', 'text'),
('header', 'help_faq', 'FAQ', 'text'),
('header', 'help_contact', 'Nous contacter', 'text'),
('header', 'help_terms', 'Conditions d''utilisation', 'text'),

-- Section Contact Form
('contact', 'form_title', 'Contactez-nous', 'text'),
('contact', 'form_description', 'Nous sommes là pour vous aider. N''hésitez pas à nous contacter pour toute question.', 'text'),
('contact', 'name_label', 'Nom complet', 'text'),
('contact', 'email_label', 'Email', 'text'),
('contact', 'subject_label', 'Sujet', 'text'),
('contact', 'message_label', 'Message', 'text'),
('contact', 'submit_button', 'Envoyer le message', 'text')

ON CONFLICT (section, key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();