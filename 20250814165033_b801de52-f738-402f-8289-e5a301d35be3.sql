-- Ajouter des champs d'adresse et détails aux destinations
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS detailed_address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS opening_hours TEXT;

-- Ajouter des détails supplémentaires aux voyages
ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS boarding_instructions TEXT,
ADD COLUMN IF NOT EXISTS special_notes TEXT;

-- Ajouter des informations supplémentaires aux réservations
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS special_requests TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT;