-- Associer les réservations existantes avec l'email foodtruck899@gmail.com à l'utilisateur correct
UPDATE public.bookings 
SET user_id = 'a4b44819-ea6a-49af-9437-453c38e12192'
WHERE passenger_email = 'foodtruck899@gmail.com' AND user_id IS NULL;