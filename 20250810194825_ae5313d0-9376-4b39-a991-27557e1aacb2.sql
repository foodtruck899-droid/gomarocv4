-- Ajouter le numéro de téléphone du conducteur à la table buses
ALTER TABLE public.buses 
ADD COLUMN driver_phone text;