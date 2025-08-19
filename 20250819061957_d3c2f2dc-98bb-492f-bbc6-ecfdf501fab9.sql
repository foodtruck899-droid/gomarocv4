-- Supprimer la vue SECURITY DEFINER et la recréer sans cette propriété
DROP VIEW IF EXISTS public.route_stops_detailed;

-- Créer une vue simple sans SECURITY DEFINER
CREATE VIEW public.route_stops_detailed AS
SELECT 
  rs.id,
  rs.route_id,
  rs.destination_id,
  rs.stop_order,
  rs.duration_from_start,
  rs.price_from_origin,
  rs.departure_time,
  rs.arrival_time,
  rs.is_final_destination,
  rs.created_at,
  d.name as destination_name,
  d.code as destination_code,
  d.address as destination_address,
  r.name as route_name
FROM public.route_stops rs
JOIN public.destinations d ON rs.destination_id = d.id
JOIN public.routes r ON rs.route_id = r.id
ORDER BY rs.route_id, rs.stop_order;