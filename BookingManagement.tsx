import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function BookingManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleManageBooking = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour gérer vos réservations",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setIsOpen(true);
  };

  // Données d'exemple
  const mockBookings = [
    {
      id: "GM123456789",
      from: "Casablanca",
      to: "Paris",
      date: "12 août 2025",
      time: "14:30",
      passengers: 2,
      price: "380€",
      status: "confirmé"
    },
    {
      id: "GM987654321",
      from: "Paris",
      to: "Marrakech",
      date: "25 août 2025",
      time: "09:15",
      passengers: 1,
      price: "195€",
      status: "en_attente"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/90 hover:bg-white hover:text-primary h-16 justify-start px-6 transition-all hover:scale-105"
          onClick={handleManageBooking}
        >
          <div className="text-left">
            <div className="font-semibold">Gérer ma réservation</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mes réservations</DialogTitle>
          <DialogDescription>
            Gérez vos réservations et voyages à venir
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {mockBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {booking.from} → {booking.to}
                  </CardTitle>
                  <Badge variant={booking.status === 'confirmé' ? 'default' : 'secondary'}>
                    {booking.status === 'confirmé' ? 'Confirmé' : 'En attente'}
                  </Badge>
                </div>
                <CardDescription>Réf: {booking.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{booking.date}, {booking.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{booking.passengers} passager{booking.passengers > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{booking.price}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Statut: {booking.status === 'confirmé' ? 'Confirmé' : 'En attente'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm">
                    Annuler
                  </Button>
                  <Button size="sm">
                    Télécharger billet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {mockBookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune réservation trouvée</p>
            <Button className="mt-4" onClick={() => setIsOpen(false)}>
              Réserver un voyage
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}