-- Go Maroc - Configuration complète de la base de données
-- Exécutez ce script dans votre dashboard Supabase (SQL Editor)

-- 1. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des destinations
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des routes
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  departure_destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  arrival_destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  duration_hours INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des bus
CREATE TABLE IF NOT EXISTS buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_number TEXT UNIQUE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 50,
  model TEXT,
  year INTEGER,
  license_plate TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
  features JSONB DEFAULT '[]', -- WiFi, AC, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des voyages programmés
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  departure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  passengers INTEGER DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_reference TEXT UNIQUE NOT NULL,
  passenger_details JSONB,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Policies pour destinations (lecture publique, écriture admin)
DROP POLICY IF EXISTS "Anyone can view active destinations" ON destinations;
DROP POLICY IF EXISTS "Admins can manage destinations" ON destinations;

CREATE POLICY "Anyone can view active destinations" ON destinations FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage destinations" ON destinations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Policies pour routes
DROP POLICY IF EXISTS "Anyone can view active routes" ON routes;
DROP POLICY IF EXISTS "Admins can manage routes" ON routes;

CREATE POLICY "Anyone can view active routes" ON routes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage routes" ON routes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Policies pour buses
DROP POLICY IF EXISTS "Anyone can view active buses" ON buses;
DROP POLICY IF EXISTS "Admins can manage buses" ON buses;

CREATE POLICY "Anyone can view active buses" ON buses FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage buses" ON buses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Policies pour trips
DROP POLICY IF EXISTS "Anyone can view scheduled trips" ON trips;
DROP POLICY IF EXISTS "Admins can manage trips" ON trips;

CREATE POLICY "Anyone can view scheduled trips" ON trips FOR SELECT USING (status = 'scheduled');
CREATE POLICY "Admins can manage trips" ON trips FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Policies pour bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;

CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can manage all bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Fonction pour créer le profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour générer une référence de réservation unique
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'GM' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement la référence de réservation
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_reference_trigger ON bookings;
CREATE TRIGGER booking_reference_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_reference();

-- Données de base : Destinations
INSERT INTO destinations (name, country, city) VALUES
('Gare CTM Casablanca', 'Maroc', 'Casablanca'),
('Gare CTM Rabat', 'Maroc', 'Rabat'),
('Gare CTM Fès', 'Maroc', 'Fès'),
('Gare CTM Marrakech', 'Maroc', 'Marrakech'),
('Gare CTM Agadir', 'Maroc', 'Agadir'),
('Gare CTM Tanger', 'Maroc', 'Tanger'),
('Gare Routière Paris Bercy', 'France', 'Paris'),
('Gare Routière Lyon Perrache', 'France', 'Lyon'),
('Gare Routière Marseille Saint-Charles', 'France', 'Marseille'),
('Gare Routière Toulouse Matabiau', 'France', 'Toulouse'),
('Gare Routière Bordeaux', 'France', 'Bordeaux'),
('Gare Routière Montpellier', 'France', 'Montpellier')
ON CONFLICT DO NOTHING;

-- Routes principales Maroc ↔ France
INSERT INTO routes (departure_destination_id, arrival_destination_id, duration_hours, base_price) 
SELECT 
  d1.id,
  d2.id,
  48, -- 48h pour trajet international
  CASE 
    WHEN d1.city = 'Casablanca' AND d2.city = 'Paris' THEN 180.00
    WHEN d1.city = 'Casablanca' AND d2.city = 'Lyon' THEN 170.00
    WHEN d1.city = 'Casablanca' AND d2.city = 'Marseille' THEN 160.00
    WHEN d1.city = 'Rabat' AND d2.city = 'Paris' THEN 185.00
    WHEN d1.city = 'Marrakech' AND d2.city = 'Paris' THEN 190.00
    WHEN d1.city = 'Tanger' AND d2.city = 'Paris' THEN 150.00
    ELSE 165.00
  END
FROM destinations d1
CROSS JOIN destinations d2
WHERE d1.country = 'Maroc' AND d2.country = 'France' AND d1.id != d2.id
ON CONFLICT DO NOTHING;

-- Routes retour France → Maroc
INSERT INTO routes (departure_destination_id, arrival_destination_id, duration_hours, base_price) 
SELECT 
  d1.id,
  d2.id,
  48, -- 48h pour trajet international
  CASE 
    WHEN d1.city = 'Paris' AND d2.city = 'Casablanca' THEN 180.00
    WHEN d1.city = 'Lyon' AND d2.city = 'Casablanca' THEN 170.00
    WHEN d1.city = 'Marseille' AND d2.city = 'Casablanca' THEN 160.00
    WHEN d1.city = 'Paris' AND d2.city = 'Rabat' THEN 185.00
    WHEN d1.city = 'Paris' AND d2.city = 'Marrakech' THEN 190.00
    WHEN d1.city = 'Paris' AND d2.city = 'Tanger' THEN 150.00
    ELSE 165.00
  END
FROM destinations d1
CROSS JOIN destinations d2
WHERE d1.country = 'France' AND d2.country = 'Maroc' AND d1.id != d2.id
ON CONFLICT DO NOTHING;

-- Routes nationales Maroc
INSERT INTO routes (departure_destination_id, arrival_destination_id, duration_hours, base_price) 
SELECT 
  d1.id,
  d2.id,
  CASE 
    WHEN d1.city = 'Casablanca' AND d2.city = 'Rabat' THEN 2
    WHEN d1.city = 'Casablanca' AND d2.city = 'Marrakech' THEN 3
    WHEN d1.city = 'Casablanca' AND d2.city = 'Fès' THEN 4
    WHEN d1.city = 'Casablanca' AND d2.city = 'Agadir' THEN 6
    WHEN d1.city = 'Casablanca' AND d2.city = 'Tanger' THEN 5
    ELSE 4
  END,
  CASE 
    WHEN d1.city = 'Casablanca' AND d2.city = 'Rabat' THEN 25.00
    WHEN d1.city = 'Casablanca' AND d2.city = 'Marrakech' THEN 35.00
    WHEN d1.city = 'Casablanca' AND d2.city = 'Fès' THEN 45.00
    WHEN d1.city = 'Casablanca' AND d2.city = 'Agadir' THEN 65.00
    WHEN d1.city = 'Casablanca' AND d2.city = 'Tanger' THEN 55.00
    ELSE 40.00
  END
FROM destinations d1
CROSS JOIN destinations d2
WHERE d1.country = 'Maroc' AND d2.country = 'Maroc' AND d1.id != d2.id
ON CONFLICT DO NOTHING;

-- Flotte de bus par défaut
INSERT INTO buses (bus_number, capacity, model, year, license_plate, features) VALUES
('GM001', 50, 'Mercedes Tourismo', 2022, '12345-MA-1', '["WiFi", "AC", "USB", "Toilettes"]'),
('GM002', 50, 'Mercedes Tourismo', 2022, '12346-MA-1', '["WiFi", "AC", "USB", "Toilettes"]'),
('GM003', 45, 'Volvo 9700', 2021, '12347-MA-1', '["WiFi", "AC", "USB", "TV"]'),
('GM004', 55, 'Scania Touring', 2023, '12348-MA-1', '["WiFi", "AC", "USB", "Toilettes", "TV"]'),
('GM005', 50, 'Mercedes Tourismo', 2022, '12349-MA-1', '["WiFi", "AC", "USB", "Toilettes"]')
ON CONFLICT DO NOTHING;

-- Voyages de démonstration (cette semaine)
INSERT INTO trips (route_id, bus_id, departure_datetime, arrival_datetime, available_seats, price)
SELECT 
  r.id,
  b.id,
  NOW() + INTERVAL '1 day' + (ROW_NUMBER() OVER() * INTERVAL '1 day'),
  NOW() + INTERVAL '1 day' + (ROW_NUMBER() OVER() * INTERVAL '1 day') + (r.duration_hours * INTERVAL '1 hour'),
  b.capacity - FLOOR(RANDOM() * 20), -- Quelques sièges déjà réservés
  r.base_price
FROM routes r
CROSS JOIN buses b
WHERE r.departure_destination_id IN (
  SELECT id FROM destinations WHERE country = 'Maroc' LIMIT 3
)
AND r.arrival_destination_id IN (
  SELECT id FROM destinations WHERE country = 'France' LIMIT 3
)
LIMIT 15
ON CONFLICT DO NOTHING;

-- ⚠️ IMPORTANT: Créer un utilisateur admin
-- Remplacez 'admin@gomaroc.com' et 'admin123456' par vos propres identifiants
-- 
-- Étapes pour créer l'admin:
-- 1. D'abord, inscrivez-vous normalement sur le site avec ces identifiants
-- 2. Puis exécutez cette requête pour changer le rôle en admin:
-- 
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'admin@gomaroc.com';
--
-- Identifiants admin par défaut:
-- Email: admin@gomaroc.com
-- Mot de passe: admin123456
--
-- ⚠️ CHANGEZ CES IDENTIFIANTS APRÈS LA PREMIÈRE CONNEXION!

-- Message de confirmation
SELECT 'Base de données Go Maroc configurée avec succès!' as message;