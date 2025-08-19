-- Ajouter les champs passeport et date de naissance à la table bookings
ALTER TABLE public.bookings 
ADD COLUMN passport_number TEXT,
ADD COLUMN date_of_birth DATE;

-- Ajouter le nom de la société à la table buses
ALTER TABLE public.buses 
ADD COLUMN company_name TEXT DEFAULT 'Go Maroc';

-- Ajouter un commentaire pour documenter les nouveaux champs
COMMENT ON COLUMN public.bookings.passport_number IS 'Numéro de passeport du passager';
COMMENT ON COLUMN public.bookings.date_of_birth IS 'Date de naissance du passager';
COMMENT ON COLUMN public.buses.company_name IS 'Nom de la société qui opère le bus';