-- Ajouter les colonnes manquantes à la table route_stops pour gérer les horaires des escales
ALTER TABLE public.route_stops 
ADD COLUMN IF NOT EXISTS departure_time TIME,
ADD COLUMN IF NOT EXISTS arrival_time TIME,
ADD COLUMN IF NOT EXISTS is_final_destination BOOLEAN DEFAULT false;

-- Créer un index pour optimiser les recherches par escales
CREATE INDEX IF NOT EXISTS idx_route_stops_route_order ON public.route_stops(route_id, stop_order);

-- Créer une vue pour faciliter les requêtes avec escales
CREATE OR REPLACE VIEW public.route_stops_detailed AS
SELECT 
  rs.*,
  d.name as destination_name,
  d.code as destination_code,
  d.address as destination_address,
  r.name as route_name
FROM public.route_stops rs
JOIN public.destinations d ON rs.destination_id = d.id
JOIN public.routes r ON rs.route_id = r.id
ORDER BY rs.route_id, rs.stop_order;