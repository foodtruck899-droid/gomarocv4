-- Créer un trigger pour générer automatiquement les références de réservation
-- s'il n'est pas déjà présent
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
    NEW.booking_reference = generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger s'il n'existe pas
DROP TRIGGER IF EXISTS trigger_set_booking_reference ON bookings;
CREATE TRIGGER trigger_set_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();