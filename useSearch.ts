import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SearchParams {
  fromCity: string;
  toCity: string;
  departureDate?: Date;
  passengers: { adults: number; children: number };
  tripType: "one-way" | "round-trip";
}

export interface Trip {
  id: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  status: string;
  route: {
    id: string;
    name: string;
    origin: {
      name: string;
      code: string;
    };
    destination: {
      name: string;
      code: string;
    };
    duration_minutes: number;
  };
  bus: {
    model: string;
    brand: string;
    capacity: number;
    amenities: string[];
    plate_number?: string;
    company_name?: string;
  };
}

interface RouteOption {
  route_id: string;
  type: 'direct' | 'segment';
  route_data?: {
    id: string;
    name: string;
    duration_minutes: number;
    origin_id: string;
    destination_id: string;
  };
  segment_data?: {
    route_id: string;
    route_name: string;
    origin_stop: any;
    destination_stop: any;
    intermediate_stops: any[];
  };
}

export const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Trip[]>([]);
  const { toast } = useToast();

  const searchTrips = async (params: SearchParams) => {
    setIsSearching(true);
    
    try {
      console.log('Recherche avec paramètres:', params);

      // Normaliser les noms de villes (enlever pays, normaliser majuscules)
      const normalizeCity = (city: string) => {
        return city
          .split(',')[0] // Enlever ", France", ", Maroc", etc.
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
          .replace(/[^a-z\s]/g, '') // Garder seulement lettres et espaces
          .trim();
      };

      const normalizedFromCity = normalizeCity(params.fromCity);
      const normalizedToCity = normalizeCity(params.toCity);

      console.log('Villes normalisées:', { from: normalizedFromCity, to: normalizedToCity });

      // Validation basique
      if (normalizedFromCity === normalizedToCity) {
        toast({
          title: "Erreur de recherche",
          description: "La ville de départ et d'arrivée ne peuvent pas être identiques",
          variant: "destructive",
        });
        setSearchResults([]);
        return [];
      }

      // Rechercher les destinations correspondantes avec une recherche plus flexible
      const { data: originDestinations } = await supabase
        .from('destinations')
        .select('id, name, code')
        .or(`name.ilike.%${normalizedFromCity}%,name.ilike.%${params.fromCity.split(',')[0].trim()}%`)
        .eq('is_active', true);

      const { data: destinationDestinations } = await supabase
        .from('destinations')
        .select('id, name, code')
        .or(`name.ilike.%${normalizedToCity}%,name.ilike.%${params.toCity.split(',')[0].trim()}%`)
        .eq('is_active', true);

      console.log('Destinations trouvées:', { origins: originDestinations, destinations: destinationDestinations });

      if (!originDestinations?.length || !destinationDestinations?.length) {
        toast({
          title: "Aucune destination trouvée",
          description: "Aucune destination correspondante dans notre base de données",
        });
        setSearchResults([]);
        return [];
      }

      const originIds = originDestinations.map(d => d.id);
      const destinationIds = destinationDestinations.map(d => d.id);

      // Rechercher les routes correspondantes (directes ET avec escales)
      const { data: directRoutes } = await supabase
        .from('routes')
        .select('id, name, duration_minutes, origin_id, destination_id')
        .in('origin_id', originIds)
        .in('destination_id', destinationIds)
        .eq('is_active', true);

      // Rechercher les routes avec escales qui passent par les villes demandées
      const { data: routesWithStops } = await supabase
        .from('route_stops_detailed')
        .select('route_id, route_name, destination_id, destination_name, stop_order, departure_time, arrival_time')
        .or(`destination_id.in.(${originIds.join(',')}),destination_id.in.(${destinationIds.join(',')})`)
        .order('route_id, stop_order');

      console.log('Routes directes:', directRoutes);
      console.log('Routes avec escales:', routesWithStops);

      // Analyser les routes avec escales pour trouver des segments valides
      const validRouteSegments = [];
      if (routesWithStops) {
        const routeGroups = routesWithStops.reduce((groups: any, stop: any) => {
          if (!groups[stop.route_id]) groups[stop.route_id] = [];
          groups[stop.route_id].push(stop);
          return groups;
        }, {});

        Object.entries(routeGroups).forEach(([routeId, stops]: [string, any]) => {
          const sortedStops = stops.sort((a: any, b: any) => a.stop_order - b.stop_order);
          
          // Trouver l'index de la ville de départ et d'arrivée
          const originIndex = sortedStops.findIndex((stop: any) => originIds.includes(stop.destination_id));
          const destIndex = sortedStops.findIndex((stop: any) => destinationIds.includes(stop.destination_id));
          
          // Vérifier si c'est un segment valide (origine avant destination)
          if (originIndex !== -1 && destIndex !== -1 && originIndex < destIndex) {
            validRouteSegments.push({
              route_id: routeId,
              route_name: sortedStops[0].route_name,
              origin_stop: sortedStops[originIndex],
              destination_stop: sortedStops[destIndex],
              intermediate_stops: sortedStops.slice(originIndex + 1, destIndex)
            });
          }
        });
      }

      // Combiner routes directes et segments valides
      const allRouteOptions: RouteOption[] = [
        ...(directRoutes || []).map(r => ({ 
          route_id: r.id, 
          type: 'direct' as const,
          route_data: r 
        })),
        ...validRouteSegments.map(s => ({ 
          route_id: s.route_id, 
          type: 'segment' as const,
          segment_data: s 
        }))
      ];

      if (allRouteOptions.length === 0) {
        toast({
          title: "Aucun itinéraire disponible",
          description: "Aucun itinéraire configuré pour ces destinations",
        });
        setSearchResults([]);
        return [];
      }

      const routeIds = allRouteOptions.map(r => r.route_id);

      // Rechercher les voyages
      let query = supabase
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
        .in('route_id', routeIds)
        .eq('status', 'scheduled')
        .gt('available_seats', 0);

      // Filtrer par date si fournie
      if (params.departureDate) {
        const searchDate = new Date(params.departureDate);
        
        // Si l'heure est spécifiée dans la date, on filtre à partir de cette heure
        // Sinon, on prend toute la journée
        if (searchDate.getHours() !== 0 || searchDate.getMinutes() !== 0) {
          // Une heure spécifique est demandée, filtrer à partir de cette heure
          console.log('Recherche à partir de:', searchDate.toISOString());
          query = query.gte('departure_time', searchDate.toISOString());
        } else {
          // Pas d'heure spécifique, prendre toute la journée
          const startOfDay = new Date(searchDate);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(searchDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          query = query
            .gte('departure_time', startOfDay.toISOString())
            .lte('departure_time', endOfDay.toISOString());
        }
      } else {
        // Si pas de date, chercher à partir d'aujourd'hui mais permettre les dates futures
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('departure_time', today.toISOString());
      }

      const { data: trips, error } = await query
        .order('departure_time', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Erreur lors de la recherche:', error);
        toast({
          title: "Erreur de recherche",
          description: "Impossible de rechercher les voyages",
          variant: "destructive",
        });
        return [];
      }

      console.log('Voyages trouvés:', trips);

      // Si aucun voyage trouvé
      if (!trips || trips.length === 0) {
        // Vérifier s'il y a des voyages pour cet itinéraire mais à d'autres dates
        const { data: allTripsForRoute } = await supabase
          .from('trips')
          .select('id, departure_time')
          .in('route_id', routeIds)
          .eq('status', 'scheduled')
          .gt('available_seats', 0)
          .order('departure_time', { ascending: true })
          .limit(3);

        if (allTripsForRoute && allTripsForRoute.length > 0) {
          const nextDates = allTripsForRoute.map(t => 
            new Date(t.departure_time).toLocaleDateString('fr-FR')
          ).join(', ');
          
          toast({
            title: "Aucun voyage pour cette date",
            description: `Prochains départs disponibles: ${nextDates}`,
          });
        } else {
          toast({
            title: "Aucun voyage programmé",
            description: "Aucun voyage n'est encore programmé pour cet itinéraire. Contactez l'administration.",
          });
        }
        setSearchResults([]);
        return [];
      }

      // Enrichir les données avec les détails des routes, destinations et bus
      const formattedTrips: Trip[] = [];
      
      for (const trip of trips) {
        const routeOption = allRouteOptions.find(r => r.route_id === trip.route_id);
        if (!routeOption) continue;

        let origin, destination, routeName;

        if (routeOption.type === 'direct' && routeOption.route_data) {
          // Route directe
          const route = routeOption.route_data;
          origin = originDestinations.find(d => d.id === route.origin_id);
          destination = destinationDestinations.find(d => d.id === route.destination_id);
          routeName = route.name;
        } else if (routeOption.type === 'segment' && routeOption.segment_data) {
          // Segment de route avec escales
          const segment = routeOption.segment_data;
          origin = { name: segment.origin_stop.destination_name, code: '' };
          destination = { name: segment.destination_stop.destination_name, code: '' };
          routeName = `${segment.route_name} (via ${segment.intermediate_stops.map((s: any) => s.destination_name).join(', ')})`;
        } else {
          continue; // Skip invalid route options
        }
        
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
              id: trip.route_id,
              name: routeName,
              origin: { name: origin.name, code: origin.code || '' },
              destination: { name: destination.name, code: destination.code || '' },
              duration_minutes: routeOption.type === 'direct' && routeOption.route_data ? routeOption.route_data.duration_minutes : 0
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

      if (formattedTrips.length === 0) {
        toast({
          title: "Aucun voyage disponible",
          description: "Aucun voyage disponible pour cette recherche",
        });
      } else {
        toast({
          title: "Recherche terminée",
          description: `${formattedTrips.length} voyage(s) trouvé(s)`,
        });
        
        // Sauvegarder les paramètres de recherche dans sessionStorage
        sessionStorage.setItem('lastSearch', JSON.stringify({
          from: params.fromCity,
          to: params.toCity,
          date: params.departureDate ? params.departureDate.toISOString().split('T')[0] : '',
          adults: params.passengers.adults,
          children: params.passengers.children
        }));
      }

      return formattedTrips;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchTrips,
    isSearching,
    searchResults,
    setSearchResults
  };
};