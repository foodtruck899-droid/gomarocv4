-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- Code unique pour la ville (ex: CAS, RAB, MAR)
  region TEXT,
  country TEXT DEFAULT 'Maroc',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- Ex: "Casablanca - Rabat"
  origin_id UUID NOT NULL REFERENCES public.destinations(id),
  destination_id UUID NOT NULL REFERENCES public.destinations(id),
  distance_km INTEGER,
  duration_minutes INTEGER, -- Durée estimée en minutes
  base_price DECIMAL(8,2) NOT NULL, -- Prix de base
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT different_origin_destination CHECK (origin_id != destination_id)
);

-- Create route_stops table for intermediate stops
CREATE TABLE public.route_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id),
  stop_order INTEGER NOT NULL, -- Ordre de l'arrêt (1, 2, 3...)
  duration_from_start INTEGER, -- Durée depuis le départ en minutes
  price_from_origin DECIMAL(8,2), -- Prix depuis l'origine
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(route_id, stop_order),
  UNIQUE(route_id, destination_id)
);

-- Create buses table
CREATE TABLE public.buses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plate_number TEXT UNIQUE NOT NULL, -- Numéro d'immatriculation
  model TEXT, -- Modèle du bus
  brand TEXT, -- Marque
  capacity INTEGER NOT NULL, -- Nombre de places
  amenities TEXT[], -- Équipements (WiFi, AC, etc.)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table for scheduled departures
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES public.routes(id),
  bus_id UUID NOT NULL REFERENCES public.buses(id),
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  available_seats INTEGER NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'boarding', 'departed', 'arrived', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL, -- Code de réservation (ex: GM123456789)
  trip_id UUID NOT NULL REFERENCES public.trips(id),
  user_id UUID REFERENCES public.profiles(id), -- Nullable pour permettre réservations anonymes
  passenger_name TEXT NOT NULL,
  passenger_email TEXT,
  passenger_phone TEXT,
  seat_numbers INTEGER[], -- Numéros des sièges réservés
  total_price DECIMAL(8,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled', 'refunded')),
  booking_status TEXT DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for destinations (public read, admin write)
CREATE POLICY "Everyone can view destinations" 
ON public.destinations FOR SELECT USING (true);

CREATE POLICY "Admins can manage destinations" 
ON public.destinations FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create policies for routes (public read, admin write)
CREATE POLICY "Everyone can view routes" 
ON public.routes FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage routes" 
ON public.routes FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create policies for route_stops (public read, admin write)
CREATE POLICY "Everyone can view route stops" 
ON public.route_stops FOR SELECT USING (true);

CREATE POLICY "Admins can manage route stops" 
ON public.route_stops FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create policies for buses (public read, admin write)
CREATE POLICY "Everyone can view buses" 
ON public.buses FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage buses" 
ON public.buses FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create policies for trips (public read, admin write)
CREATE POLICY "Everyone can view trips" 
ON public.trips FOR SELECT USING (true);

CREATE POLICY "Admins can manage trips" 
ON public.trips FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create policies for bookings (users can see their own, admins see all)
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all bookings" 
ON public.bookings FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can create bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = user_id OR get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all bookings" 
ON public.bookings FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_routes_origin ON public.routes(origin_id);
CREATE INDEX idx_routes_destination ON public.routes(destination_id);
CREATE INDEX idx_trips_route ON public.trips(route_id);
CREATE INDEX idx_trips_departure ON public.trips(departure_time);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX idx_bookings_trip ON public.bookings(trip_id);

-- Create triggers for updated_at
CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buses_updated_at
  BEFORE UPDATE ON public.buses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial destinations
INSERT INTO public.destinations (name, code, region) VALUES
('Casablanca', 'CAS', 'Grand Casablanca'),
('Rabat', 'RAB', 'Rabat-Salé-Kénitra'),
('Marrakech', 'MAR', 'Marrakech-Safi'),
('Fès', 'FES', 'Fès-Meknès'),
('Tanger', 'TAN', 'Tanger-Tétouan-Al Hoceïma'),
('Agadir', 'AGA', 'Souss-Massa'),
('Meknès', 'MEK', 'Fès-Meknès'),
('Oujda', 'OUJ', 'Oriental'),
('Tétouan', 'TET', 'Tanger-Tétouan-Al Hoceïma'),
('El Jadida', 'JAD', 'Casablanca-Settat');

-- Generate booking reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'GM' || LPAD(nextval('booking_ref_seq')::TEXT, 9, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for booking references
CREATE SEQUENCE booking_ref_seq START 100000001;

-- Function to automatically generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference = generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking reference
CREATE TRIGGER set_booking_reference_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();