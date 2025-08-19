-- Créer une fonction pour incrémenter les sièges disponibles
CREATE OR REPLACE FUNCTION public.increment_available_seats(trip_id uuid, seats_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.trips 
  SET available_seats = available_seats + seats_to_add,
      updated_at = now()
  WHERE id = trip_id;
END;
$$;

-- Créer un cron job pour nettoyer les réservations expirées (toutes les heures)
SELECT cron.schedule(
  'cleanup-expired-bookings',
  '0 * * * *', -- Toutes les heures à la minute 0
  $$
  SELECT
    net.http_post(
        url:='https://haxjenuqrzyzmrswkzbq.supabase.co/functions/v1/cleanup-expired-bookings',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheGplbnVxcnp5em1yc3dremJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjMxNDMsImV4cCI6MjA3MDM5OTE0M30.MtyZ3s3ikN-JmsATXqiokxVLVeGwzNVqL1Uavpf3ars"}'::jsonb,
        body:='{"action": "cleanup"}'::jsonb
    ) as request_id;
  $$
);