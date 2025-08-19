import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Star } from "lucide-react";
import { Trip } from "@/hooks/useSearch";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { RouteStopsDetail } from "@/components/RouteStopsDetail";

interface SearchResultsProps {
  trips: Trip[];
  isLoading: boolean;
}

export const SearchResults = ({ trips, isLoading }: SearchResultsProps) => {
  const navigate = useNavigate();
  
  const handleBooking = (trip: Trip) => {
    const searchParams = new URLSearchParams();
    searchParams.set("tripId", trip.id);
    searchParams.set("adults", "1");
    searchParams.set("children", "0");
    
    navigate(`/booking?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Aucun voyage trouvé pour votre recherche.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: fr });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {trips.length} voyage{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
        </h2>
      </div>

      {trips.map((trip) => (
        <Card key={trip.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Horaires et villes */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatTime(trip.departure_time)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trip.route.origin.name}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center mx-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(trip.route.duration_minutes)}
                    </div>
                    <div className="w-full h-px bg-border my-1"></div>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatTime(trip.arrival_time)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trip.route.destination.name}
                    </div>
                  </div>
                </div>
                
                {/* Afficher les escales si le voyage en a */}
                <RouteStopsDetail routeId={trip.route.id} className="mt-2" />
                
                <div className="text-xs text-muted-foreground text-center">
                  {formatDate(trip.departure_time)}
                </div>
              </div>

              {/* Informations du bus */}
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {trip.bus.company_name || 'Go Maroc'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {trip.bus.brand} {trip.bus.model}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {trip.available_seats} places disponibles
                </div>
                {trip.bus.amenities && trip.bus.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {trip.bus.amenities.slice(0, 2).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">4.5</span>
                </div>
              </div>

              {/* Prix et réservation */}
              <div className="text-right space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {trip.price}€
                </div>
                <div className="text-sm text-muted-foreground">
                  par personne
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleBooking(trip)}
                >
                  Réserver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};