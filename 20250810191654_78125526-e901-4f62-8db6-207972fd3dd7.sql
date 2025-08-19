-- Ajouter les clés étrangères manquantes pour les tables

-- Pour la table routes
ALTER TABLE routes 
ADD CONSTRAINT routes_origin_id_fkey 
FOREIGN KEY (origin_id) REFERENCES destinations(id);

ALTER TABLE routes 
ADD CONSTRAINT routes_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES destinations(id);

-- Pour la table trips
ALTER TABLE trips 
ADD CONSTRAINT trips_route_id_fkey 
FOREIGN KEY (route_id) REFERENCES routes(id);

ALTER TABLE trips 
ADD CONSTRAINT trips_bus_id_fkey 
FOREIGN KEY (bus_id) REFERENCES buses(id);

-- Pour la table bookings
ALTER TABLE bookings 
ADD CONSTRAINT bookings_trip_id_fkey 
FOREIGN KEY (trip_id) REFERENCES trips(id);

ALTER TABLE bookings 
ADD CONSTRAINT bookings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Pour la table route_stops
ALTER TABLE route_stops 
ADD CONSTRAINT route_stops_route_id_fkey 
FOREIGN KEY (route_id) REFERENCES routes(id);

ALTER TABLE route_stops 
ADD CONSTRAINT route_stops_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES destinations(id);

-- Pour la table profiles
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id);

-- Corriger les contraintes uniques
ALTER TABLE destinations ADD CONSTRAINT destinations_code_unique UNIQUE (code);
ALTER TABLE destinations ADD CONSTRAINT destinations_name_country_unique UNIQUE (name, country);