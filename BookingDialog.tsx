import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trip } from "@/hooks/useSearch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, CreditCard } from "lucide-react";

interface BookingDialogProps {
  trip: Trip;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingDialog = ({ trip, isOpen, onOpenChange }: BookingDialogProps) => {
  const [formData, setFormData] = useState({
    passenger_name: "",
    passenger_email: "",
    passenger_phone: "",
    passport_number: "",
    date_of_birth: "",
    adults: 1,
    children: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalPassengers = formData.adults + formData.children;
  const totalPrice = trip.price * totalPassengers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier qu'il y a assez de places disponibles
      if (totalPassengers > trip.available_seats) {
        toast({
          title: "Erreur",
          description: "Pas assez de places disponibles",
          variant: "destructive",
        });
        return;
      }

      // Créer la réservation (la référence sera générée automatiquement par le trigger)
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          trip_id: trip.id,
          passenger_name: formData.passenger_name,
          passenger_email: formData.passenger_email,
          passenger_phone: formData.passenger_phone,
          passport_number: formData.passport_number,
          date_of_birth: formData.date_of_birth,
          total_price: totalPrice,
          payment_status: 'pending',
          booking_status: 'confirmed',
          booking_reference: '' // Sera remplacé par le trigger
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la réservation:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la réservation",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour les places disponibles
      const { error: updateError } = await supabase
        .from('trips')
        .update({
          available_seats: trip.available_seats - totalPassengers
        })
        .eq('id', trip.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour des places:', updateError);
      }

      toast({
        title: "Réservation confirmée !",
        description: `Votre référence de réservation: ${booking.booking_reference}`,
      });

      onOpenChange(false);
      
      // Optionnel: rediriger vers une page de confirmation
      // navigate(`/booking-confirmation/${booking.booking_reference}`);
      
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: fr });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Réserver votre voyage</DialogTitle>
          <DialogDescription>
            Complétez vos informations pour finaliser votre réservation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Détails du voyage */}
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">Détails du voyage</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{trip.route.origin.name}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{trip.route.destination.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTime(trip.departure_time)} - {formatTime(trip.arrival_time)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(trip.departure_time)}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {trip.bus.brand} {trip.bus.model} • {trip.available_seats} places disponibles
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informations passager */}
            <div className="space-y-4">
              <h3 className="font-semibold">Informations du passager principal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passenger_name">Nom complet *</Label>
                  <Input
                    id="passenger_name"
                    value={formData.passenger_name}
                    onChange={(e) => setFormData({...formData, passenger_name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passenger_email">Email *</Label>
                  <Input
                    id="passenger_email"
                    type="email"
                    value={formData.passenger_email}
                    onChange={(e) => setFormData({...formData, passenger_email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passenger_phone">Téléphone *</Label>
                  <Input
                    id="passenger_phone"
                    type="tel"
                    value={formData.passenger_phone}
                    onChange={(e) => setFormData({...formData, passenger_phone: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passport_number">Numéro de passeport *</Label>
                  <Input
                    id="passport_number"
                    value={formData.passport_number}
                    onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
                    placeholder="Ex: AB1234567"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date de naissance *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adults">Nombre d'adultes</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max={trip.available_seats}
                    value={formData.adults}
                    onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Résumé des prix */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Résumé des prix
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{formData.adults} adulte(s) × {trip.price}€</span>
                  <span>{formData.adults * trip.price}€</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between">
                    <span>{formData.children} enfant(s) × {trip.price}€</span>
                    <span>{formData.children * trip.price}€</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{totalPrice}€</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || totalPassengers > trip.available_seats}
                className="flex-1"
              >
                {isSubmitting ? "Réservation..." : `Réserver (${totalPrice}€)`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};