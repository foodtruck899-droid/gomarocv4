-- Créer le trigger pour générer automatiquement la référence de réservation
CREATE TRIGGER set_booking_reference_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_booking_reference();