-- Ajouter les données initiales pour les destinations populaires
INSERT INTO site_content (section, key, value, content_type) VALUES
('popular_destinations', 'section_title', 'Destinations populaires', 'text'),
('popular_destinations', 'destination_1', '{"title": "Marrakech", "location": "Marrakech, Maroc", "price": "€45", "rating": 5, "reviews": 156, "image_url": "/placeholder.svg"}', 'destination'),
('popular_destinations', 'destination_2', '{"title": "Casablanca", "location": "Casablanca, Maroc", "price": "€35", "rating": 4, "reviews": 89, "image_url": "/placeholder.svg"}', 'destination'),
('popular_destinations', 'destination_3', '{"title": "Rabat", "location": "Rabat, Maroc", "price": "€40", "rating": 5, "reviews": 124, "image_url": "/placeholder.svg"}', 'destination'),
('popular_destinations', 'destination_4', '{"title": "Fès", "location": "Fès, Maroc", "price": "€38", "rating": 4, "reviews": 97, "image_url": "/placeholder.svg"}', 'destination'),
('popular_destinations', 'destination_5', '{"title": "Agadir", "location": "Agadir, Maroc", "price": "€50", "rating": 5, "reviews": 203, "image_url": "/placeholder.svg"}', 'destination'),
('popular_destinations', 'destination_6', '{"title": "Tanger", "location": "Tanger, Maroc", "price": "€42", "rating": 4, "reviews": 134, "image_url": "/placeholder.svg"}', 'destination');

-- Ajouter les données initiales pour les témoignages clients
INSERT INTO site_content (section, key, value, content_type) VALUES
('customer_testimonials', 'section_title', 'Ce que disent nos clients', 'text'),
('customer_testimonials', 'testimonial_1', '{"name": "Sarah Martin", "location": "Paris, France", "rating": 5, "comment": "Excellent service ! Personnel très professionnel et bus très confortable. Je recommande vivement pour voyager au Maroc.", "avatar_url": "/placeholder.svg"}', 'testimonial'),
('customer_testimonials', 'testimonial_2', '{"name": "Ahmed Bennani", "location": "Casablanca, Maroc", "rating": 5, "comment": "Très satisfait de mon voyage. Ponctualité parfaite et service client irréprochable. Merci Go Maroc !", "avatar_url": "/placeholder.svg"}', 'testimonial'),
('customer_testimonials', 'testimonial_3', '{"name": "Marie Dubois", "location": "Lyon, France", "rating": 4, "comment": "Super expérience ! Bus moderne et propre, chauffeur très sympa. Un peu long mais c\'est normal pour la distance.", "avatar_url": "/placeholder.svg"}', 'testimonial'),
('customer_testimonials', 'testimonial_4', '{"name": "Youssef El Amrani", "location": "Marrakech, Maroc", "rating": 5, "comment": "Service impeccable ! J\'ai pu voyager en toute sérénité. Les prix sont très compétitifs par rapport à la concurrence.", "avatar_url": "/placeholder.svg"}', 'testimonial'),
('customer_testimonials', 'testimonial_5', '{"name": "Claire Petit", "location": "Bordeaux, France", "rating": 5, "comment": "Première expérience avec Go Maroc et je suis ravie ! Réservation facile, voyage confortable. Je reviendrai !", "avatar_url": "/placeholder.svg"}', 'testimonial'),
('customer_testimonials', 'testimonial_6', '{"name": "Karim Tazi", "location": "Rabat, Maroc", "rating": 4, "comment": "Très bon rapport qualité-prix. Le personnel est accueillant et les horaires sont respectés. Parfait pour les voyages familiaux.", "avatar_url": "/placeholder.svg"}', 'testimonial');