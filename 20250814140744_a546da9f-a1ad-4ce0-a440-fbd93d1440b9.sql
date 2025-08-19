-- Modifier la contrainte de booking_status pour accepter 'pending'
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_booking_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_booking_status_check 
CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed'));