-- Ajouter la colonne stripe_session_id à la table bookings pour le tracking Stripe
ALTER TABLE public.bookings 
ADD COLUMN stripe_session_id TEXT;