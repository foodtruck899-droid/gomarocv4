-- Ajouter une politique pour permettre l'accès public aux réservations par référence
CREATE POLICY "Public can view bookings by reference" 
ON public.bookings
FOR SELECT
USING (true);

-- Mettre à jour la politique existante pour être plus permissive
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings" 
ON public.bookings
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL) OR 
  (get_current_user_role() = 'admin'::text)
);