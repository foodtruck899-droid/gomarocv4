import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Calendar, Users, CheckCircle, Clock, XCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BookingDetailsModal } from "@/components/BookingDetailsModal";

interface Booking {
  id: string;
  booking_reference: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  departure_time: string;
  return_date?: string;
  adults: number;
  children: number;
  status: string;
  passenger_name: string;
  price_amount: number;
  currency: string;
}

export function BookingTracking() {
  const [bookingRef, setBookingRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      // Récupérer les vraies réservations depuis la base de données
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trips (
            departure_time,
            arrival_time,
            boarding_instructions,
            special_notes,
            routes (
              name,
              duration_minutes,
              origin_destinations:destinations!routes_origin_id_fkey (
                name, address, detailed_address, postal_code, phone, opening_hours
              ),
              destination_destinations:destinations!routes_destination_id_fkey (
                name, address, detailed_address, postal_code, phone, opening_hours
              )
            ),
            buses (
              brand, model, plate_number, capacity, amenities
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        setRecentBookings([]);
        return;
      }

      if (!bookingsData || bookingsData.length === 0) {
        setRecentBookings([]);
        return;
      }

      // Traiter les vraies réservations
      const formattedBookings = bookingsData.map(booking => ({
        id: booking.id,
        booking_reference: booking.booking_reference,
        from_city: booking.trips?.routes?.origin_destinations?.name || "N/A",
        to_city: booking.trips?.routes?.destination_destinations?.name || "N/A",
        departure_date: booking.trips?.departure_time?.split('T')[0] || "",
        departure_time: booking.trips?.departure_time ? new Date(booking.trips.departure_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "",
        adults: 1, // Vous pouvez ajouter ces champs à la table bookings si nécessaire
        children: 0,
        status: booking.booking_status || 'confirmed',
        passenger_name: booking.passenger_name,
        price_amount: booking.total_price,
        currency: "EUR"
      }));

      setRecentBookings(formattedBookings);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      setRecentBookings([]);
    }
  };

  const handleSearch = async () => {
    if (!bookingRef.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre numéro de réservation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Rechercher la vraie réservation dans la base de données
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trips (
            departure_time,
            arrival_time,
            routes (
              name,
              destinations!routes_origin_id_fkey (name),
              destination:destinations!routes_destination_id_fkey (name)
            )
          )
        `)
        .eq('booking_reference', bookingRef.toUpperCase())
        .single();

      if (error || !bookingData) {
        toast({
          title: "Réservation non trouvée",
          description: "Vérifiez votre numéro de réservation",
          variant: "destructive",
        });
        setFoundBooking(null);
        return;
      }

      // Formater les données de réservation
      const formattedBooking: Booking = {
        id: bookingData.id,
        booking_reference: bookingData.booking_reference,
        from_city: bookingData.trips?.routes?.destinations?.name || "N/A",
        to_city: bookingData.trips?.routes?.destination?.name || "N/A",
        departure_date: bookingData.trips?.departure_time?.split('T')[0] || "",
        departure_time: bookingData.trips?.departure_time ? 
          new Date(bookingData.trips.departure_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "",
        adults: 1, // À améliorer avec des champs spécifiques
        children: 0,
        status: bookingData.booking_status || 'confirmed',
        passenger_name: bookingData.passenger_name,
        price_amount: bookingData.total_price,
        currency: "EUR"
      };

      setFoundBooking(formattedBooking);
      toast({
        title: "Réservation trouvée",
        description: `Voyage ${formattedBooking.from_city} → ${formattedBooking.to_city}`,
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const showBookingDetails = async (booking: Booking) => {
    try {
      // Récupérer les détails complets de la réservation
      const { data: detailedBooking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trips (
            departure_time,
            arrival_time,
            price,
            boarding_instructions,
            special_notes,
            routes (
              name,
              duration_minutes,
              origin_destinations:destinations!routes_origin_id_fkey (
                name, address, detailed_address, postal_code, phone, opening_hours
              ),
              destination_destinations:destinations!routes_destination_id_fkey (
                name, address, detailed_address, postal_code, phone, opening_hours
              )
            ),
            buses (
              brand, model, plate_number, capacity, amenities
            )
          )
        `)
        .eq('booking_reference', booking.booking_reference)
        .single();

      if (error || !detailedBooking) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la réservation",
          variant: "destructive",
        });
        return;
      }

      // Formater les données pour le modal
      const formattedDetailedBooking = {
        ...detailedBooking,
        trip: {
          ...detailedBooking.trips,
          route: {
            name: detailedBooking.trips.routes.name,
            duration_minutes: detailedBooking.trips.routes.duration_minutes,
            origin: detailedBooking.trips.routes.origin_destinations,
            destination: detailedBooking.trips.routes.destination_destinations,
          },
          bus: detailedBooking.trips.buses
        }
      };

      setSelectedBooking(formattedDetailedBooking);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des détails",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild id="booking-tracking">
        <Button variant="outline" className="bg-white/90 hover:bg-white text-foreground h-16 justify-start px-6 transition-all hover:scale-105">
          <div className="text-left">
            <div className="font-semibold">Suivre mon voyage</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suivre votre voyage</DialogTitle>
          <DialogDescription>
            Entrez votre numéro de réservation pour suivre votre voyage en temps réel
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-ref">Numéro de réservation</Label>
            <Input
              id="booking-ref"
              placeholder="ex: GM123456789"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            className="w-full" 
            disabled={isLoading}
          >
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Recherche..." : "Suivre mon voyage"}
          </Button>
        </div>
        
        {foundBooking && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Réservation trouvée:</h4>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{foundBooking.from_city} → {foundBooking.to_city}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    {getStatusIcon(foundBooking.status)}
                    {getStatusText(foundBooking.status)}
                  </Badge>
                </div>
                <CardDescription className="text-xs">Réf: {foundBooking.booking_reference}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-xs">
                  <Calendar className="mr-2 h-3 w-3" />
                  <span>Départ: {new Date(foundBooking.departure_date).toLocaleDateString('fr-FR')} à {foundBooking.departure_time}</span>
                </div>
                <div className="flex items-center text-xs">
                  <Users className="mr-2 h-3 w-3" />
                  <span>{foundBooking.adults} adulte(s) {foundBooking.children > 0 && `+ ${foundBooking.children} enfant(s)`}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="font-medium">{foundBooking.price_amount} {foundBooking.currency}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => showBookingDetails(foundBooking)}
                >
                  <Info className="mr-1 h-3 w-3" />
                  Plus de détails
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!foundBooking && recentBookings.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Dernières réservations:</h4>
            {recentBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{booking.from_city} → {booking.to_city}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      {getStatusIcon(booking.status)}
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">Réf: {booking.booking_reference}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-xs">
                    <Calendar className="mr-2 h-3 w-3" />
                    <span>Départ: {new Date(booking.departure_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Users className="mr-2 h-3 w-3" />
                    <span>{booking.adults} adulte(s) {booking.children > 0 && `+ ${booking.children} enfant(s)`}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => showBookingDetails(booking)}
                  >
                    <Info className="mr-1 h-3 w-3" />
                    Plus de détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
      
      <BookingDetailsModal 
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </Dialog>
  );
}