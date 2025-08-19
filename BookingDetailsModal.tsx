import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, CheckCircle, Clock, XCircle, Phone, Info, Navigation, Bus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DetailedBooking {
  id: string;
  booking_reference: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  total_price: number;
  payment_status: string;
  booking_status: string;
  created_at: string;
  special_requests?: string;
  emergency_contact?: string;
  trip: {
    departure_time: string;
    arrival_time: string;
    price: number;
    boarding_instructions?: string;
    special_notes?: string;
    route: {
      name: string;
      duration_minutes: number;
      origin: {
        name: string;
        address?: string;
        detailed_address?: string;
        postal_code?: string;
        phone?: string;
        opening_hours?: string;
      };
      destination: {
        name: string;
        address?: string;
        detailed_address?: string;
        postal_code?: string;
        phone?: string;
        opening_hours?: string;
      };
    };
    bus: {
      model: string;
      brand: string;
      plate_number: string;
      capacity: number;
      amenities?: string[];
    };
  };
}

interface BookingDetailsModalProps {
  booking: DetailedBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!booking) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm', { locale: fr });
  };

  const formatDate = (timeString: string) => {
    return format(new Date(timeString), 'EEEE d MMMM yyyy', { locale: fr });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Détails de la réservation
          </DialogTitle>
          <DialogDescription>
            Référence: {booking.booking_reference}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statut et informations de base */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{booking.trip.route.origin.name} → {booking.trip.route.destination.name}</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(booking.booking_status)}
                  {getStatusText(booking.booking_status)}
                </Badge>
              </div>
              <CardDescription>
                Réservé le {format(new Date(booking.created_at), 'PPP', { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Départ:</span>
                  <p className="font-medium">{formatDate(booking.trip.departure_time)}</p>
                  <p className="text-lg font-bold">{formatTime(booking.trip.departure_time)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Arrivée:</span>
                  <p className="font-medium">{formatDate(booking.trip.arrival_time)}</p>
                  <p className="text-lg font-bold">{formatTime(booking.trip.arrival_time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails des lieux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lieu de départ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Point de départ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{booking.trip.route.origin.name}</p>
                {booking.trip.route.origin.address && (
                  <p className="text-muted-foreground">{booking.trip.route.origin.address}</p>
                )}
                {booking.trip.route.origin.detailed_address && (
                  <p className="text-muted-foreground">{booking.trip.route.origin.detailed_address}</p>
                )}
                {booking.trip.route.origin.postal_code && (
                  <p className="text-muted-foreground">{booking.trip.route.origin.postal_code}</p>
                )}
                {booking.trip.route.origin.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{booking.trip.route.origin.phone}</span>
                  </div>
                )}
                {booking.trip.route.origin.opening_hours && (
                  <p className="text-xs text-muted-foreground">Horaires: {booking.trip.route.origin.opening_hours}</p>
                )}
              </CardContent>
            </Card>

            {/* Lieu d'arrivée */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Point d'arrivée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{booking.trip.route.destination.name}</p>
                {booking.trip.route.destination.address && (
                  <p className="text-muted-foreground">{booking.trip.route.destination.address}</p>
                )}
                {booking.trip.route.destination.detailed_address && (
                  <p className="text-muted-foreground">{booking.trip.route.destination.detailed_address}</p>
                )}
                {booking.trip.route.destination.postal_code && (
                  <p className="text-muted-foreground">{booking.trip.route.destination.postal_code}</p>
                )}
                {booking.trip.route.destination.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{booking.trip.route.destination.phone}</span>
                  </div>
                )}
                {booking.trip.route.destination.opening_hours && (
                  <p className="text-xs text-muted-foreground">Horaires: {booking.trip.route.destination.opening_hours}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informations du véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bus className="h-4 w-4" />
                Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Marque/Modèle:</span>
                  <p className="font-medium">{booking.trip.bus.brand} {booking.trip.bus.model}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Immatriculation:</span>
                  <p className="font-medium">{booking.trip.bus.plate_number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacité:</span>
                  <p className="font-medium">{booking.trip.bus.capacity} places</p>
                </div>
              </div>
              {booking.trip.bus.amenities && booking.trip.bus.amenities.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Équipements:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {booking.trip.bus.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations passager */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Informations passager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Nom:</span>
                  <p className="font-medium">{booking.passenger_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{booking.passenger_email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Téléphone:</span>
                  <p className="font-medium">{booking.passenger_phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Prix total:</span>
                  <p className="font-bold text-primary">{booking.total_price}€</p>
                </div>
              </div>
              {booking.emergency_contact && (
                <div>
                  <span className="text-muted-foreground">Contact d'urgence:</span>
                  <p className="font-medium">{booking.emergency_contact}</p>
                </div>
              )}
              {booking.special_requests && (
                <div>
                  <span className="text-muted-foreground">Demandes spéciales:</span>
                  <p className="font-medium">{booking.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions et notes */}
          {(booking.trip.boarding_instructions || booking.trip.special_notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instructions importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {booking.trip.boarding_instructions && (
                  <div>
                    <span className="text-muted-foreground">Instructions d'embarquement:</span>
                    <p className="font-medium">{booking.trip.boarding_instructions}</p>
                  </div>
                )}
                {booking.trip.special_notes && (
                  <div>
                    <span className="text-muted-foreground">Notes spéciales:</span>
                    <p className="font-medium">{booking.trip.special_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}