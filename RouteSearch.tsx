import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Users, Star } from "lucide-react";
import CityAutocomplete from "@/components/CityAutocomplete";
import { DatePicker } from "@/components/DatePicker";
import { useSearch } from "@/hooks/useSearch";
import { SearchResults } from "@/components/SearchResults";
import { supabase } from "@/integrations/supabase/client";

const RouteSearch = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { searchTrips, isSearching: hookIsSearching, searchResults, setSearchResults } = useSearch();

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      return;
    }
    
    searchTrips({
      fromCity,
      toCity,
      departureDate,
      passengers: { adults: 1, children: 0 },
      tripType: "one-way"
    });
    
    setHasSearched(true);
  };

  // Charger tous les trajets disponibles au démarrage
  useEffect(() => {
    if (!hasSearched) {
      loadAllAvailableTrips();
    }
  }, [hasSearched]);

  const loadAllAvailableTrips = async () => {
    try {
      setIsSearching(true);
      
      // Récupérer tous les trajets disponibles aujourd'hui et plus tard
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: trips, error } = await supabase
        .from('trips')
        .select(`
          id,
          departure_time,
          arrival_time,
          price,
          available_seats,
          status,
          route_id,
          bus_id
        `)
        .eq('status', 'scheduled')
        .gt('available_seats', 0)
        .gte('departure_time', today.toISOString())
        .order('departure_time', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Erreur lors du chargement des trajets:', error);
        setIsSearching(false);
        return;
      }

      console.log('Trajets trouvés:', trips);

      if (!trips || trips.length === 0) {
        setIsSearching(false);
        return;
      }

      // Enrichir les données avec les détails des routes, destinations et bus
      const formattedTrips = [];
      
      for (const trip of trips) {
        // Récupérer les détails de la route
        const { data: route } = await supabase
          .from('routes')
          .select('id, name, duration_minutes, origin_id, destination_id')
          .eq('id', trip.route_id)
          .single();

        if (!route) continue;

        // Récupérer l'origine et la destination
        const { data: origin } = await supabase
          .from('destinations')
          .select('id, name, code')
          .eq('id', route.origin_id)
          .single();

        const { data: destination } = await supabase
          .from('destinations')
          .select('id, name, code')
          .eq('id', route.destination_id)
          .single();

        // Récupérer les détails du bus
        const { data: busDetails } = await supabase
          .from('buses')
          .select('model, brand, capacity, amenities, plate_number, company_name')
          .eq('id', trip.bus_id)
          .single();

        if (origin && destination && busDetails) {
          formattedTrips.push({
            id: trip.id,
            departure_time: trip.departure_time,
            arrival_time: trip.arrival_time,
            price: trip.price,
            available_seats: trip.available_seats,
            status: trip.status,
            route: {
              id: route.id,
              name: route.name,
              origin: { name: origin.name, code: origin.code },
              destination: { name: destination.name, code: destination.code },
              duration_minutes: route.duration_minutes
            },
            bus: {
              model: busDetails.model || '',
              brand: busDetails.brand || '',
              capacity: busDetails.capacity,
              amenities: busDetails.amenities || [],
              plate_number: busDetails.plate_number || '',
              company_name: busDetails.company_name || 'Go Maroc'
            }
          });
        }
      }

      setSearchResults(formattedTrips);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rechercher un trajet</h1>
          <p className="text-muted-foreground">Trouvez le meilleur trajet pour votre voyage</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recherche rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <CityAutocomplete
                label="Départ"
                placeholder="Ville de départ"
                value={fromCity}
                onChange={setFromCity}
              />
              <CityAutocomplete
                label="Arrivée"
                placeholder="Ville d'arrivée"
                value={toCity}
                onChange={setToCity}
              />
              <DatePicker
                label="Date de départ"
                placeholder="Choisir une date"
                value={departureDate}
                onChange={setDepartureDate}
              />
              <div className="flex items-end">
                <Button 
                  className="w-full h-10"
                  onClick={handleSearch}
                  disabled={!fromCity || !toCity || isSearching || hookIsSearching}
                >
                  {isSearching || hookIsSearching ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {hasSearched && fromCity && toCity 
              ? `Trajets ${fromCity} → ${toCity}` 
              : "Trajets populaires"
            }
          </h2>
          
          <SearchResults trips={searchResults} isLoading={isSearching || hookIsSearching} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RouteSearch;