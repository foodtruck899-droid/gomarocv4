import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Mail, Phone, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BookingDetails {
  id: string;
  booking_reference: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  total_price: number;
  payment_status: string;
  booking_status: string;
  created_at: string;
  trip: {
    departure_time: string;
    arrival_time: string;
    price: number;
    route: {
      name: string;
      origin: { name: string };
      destination: { name: string };
      duration_minutes: number;
    };
    bus: {
      model: string;
      brand: string;
      plate_number: string;
    };
  };
}

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
  
  const bookingRef = searchParams.get("ref");

  useEffect(() => {
    if (bookingRef) {
      loadBookingDetails();
      
      // Vérifier le statut du paiement si on vient de Stripe
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success') {
        console.log("🔍 Vérification du paiement après retour de Stripe");
        setTimeout(() => verifyPayment(), 2000); // Attendre 2s pour que Stripe ait le temps de traiter
      }
    }
  }, [bookingRef]);

  const verifyPayment = async () => {
    if (!bookingRef) return;
    
    try {
      console.log("🔍 Vérification du paiement pour:", bookingRef);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { booking_reference: bookingRef }
      });

      console.log("📄 Résultat vérification:", { data, error });

      if (error) {
        console.error("❌ Erreur vérification:", error);
        return;
      }

      if (data?.updated) {
        console.log("✅ Paiement confirmé, rechargement des détails...");
        await loadBookingDetails();
        toast({
          title: "Paiement confirmé !",
          description: "Votre réservation a été confirmée avec succès.",
        });
      }
    } catch (error) {
      console.error("💥 Erreur vérification paiement:", error);
    }
  };

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_reference,
          passenger_name,
          passenger_email,
          passenger_phone,
          total_price,
          payment_status,
          booking_status,
          created_at,
          trips (
            departure_time,
            arrival_time,
            price,
            routes (
              name,
              duration_minutes,
              origin_destinations:destinations!routes_origin_id_fkey(name),
              destination_destinations:destinations!routes_destination_id_fkey(name)
            ),
            buses (
              model,
              brand,
              plate_number
            )
          )
        `)
        .eq('booking_reference', bookingRef)
        .maybeSingle();

      if (error || !data) {
        console.error('Erreur chargement réservation:', error);
        throw error || new Error('Réservation non trouvée');
      }

      // Reformater les données pour correspondre à l'interface
      const formattedBooking: BookingDetails = {
        id: data.id,
        booking_reference: data.booking_reference,
        passenger_name: data.passenger_name,
        passenger_email: data.passenger_email,
        passenger_phone: data.passenger_phone,
        total_price: data.total_price,
        payment_status: data.payment_status,
        booking_status: data.booking_status,
        created_at: data.created_at,
        trip: {
          departure_time: data.trips.departure_time,
          arrival_time: data.trips.arrival_time,
          price: data.trips.price,
          route: {
            name: data.trips.routes.name,
            origin: { name: data.trips.routes.origin_destinations?.name || '' },
            destination: { name: data.trips.routes.destination_destinations?.name || '' },
            duration_minutes: data.trips.routes.duration_minutes
          },
          bus: {
            model: data.trips.buses.model,
            brand: data.trips.buses.brand,
            plate_number: data.trips.buses.plate_number
          }
        }
      };

      setBooking(formattedBooking);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm', { locale: fr });
  };

  const formatDate = (timeString: string) => {
    return format(new Date(timeString), 'EEEE d MMMM yyyy', { locale: fr });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente de paiement</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const downloadTicket = async () => {
    if (!booking) return;
    
    setIsDownloading(true);
    try {
      const pdf = new jsPDF();
      
      // Logo/En-tête (simulation logo)
      pdf.setFillColor(199, 149, 26); // Couleur brand
      pdf.rect(20, 15, 30, 12, 'F');
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('GOMAROC', 22, 23);
      
      // Titre principal
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('BILLET', 20, 45);
      
      // Date et lieu
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text(`${format(new Date(), 'dd/MM/yyyy')}`, 20, 60);
      
      // Salutation
      pdf.setFontSize(10);
      pdf.text('Bonjour,', 20, 75);
      
      // Texte d'introduction
      pdf.setFontSize(9);
      pdf.text(`Vous trouverez ci-dessous le justificatif de voyage concernant le voyage du`, 20, 90);
      pdf.text(`${formatDate(booking.trip.departure_time)} pour le voyageur ${booking.passenger_name.toUpperCase()}.`, 20, 100);
      
      // Note importante
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Nous attirons votre attention sur le fait que ce justificatif ne constitue en aucun cas un titre de transport.`, 20, 115);
      
      // Informations du voyage - Style tableau
      let yPos = 140;
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(9);
      
      // Prestation
      pdf.setFont(undefined, 'normal');
      pdf.text('Prestation', 20, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text('Transport Voyageurs', 120, yPos);
      
      // Ligne séparatrice
      pdf.setLineWidth(0.2);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      // Trajet
      pdf.setFont(undefined, 'normal');
      pdf.text(`Aller le ${formatDate(booking.trip.departure_time)}`, 20, yPos);
      pdf.text('Classe Standard', 120, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      pdf.text(`De ${booking.trip.route.origin.name}`, 20, yPos);
      pdf.text(`pour 1 adulte(s)`, 120, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      pdf.text(`à ${booking.trip.route.destination.name}`, 20, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 20;
      
      // Montant
      pdf.setFont(undefined, 'normal');
      pdf.text('Montant du voyage', 20, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${booking.total_price},00 €`, 120, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      // Référence
      pdf.setFont(undefined, 'normal');
      pdf.text('Référence de commande', 20, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(booking.booking_reference, 120, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      // Heure de départ
      pdf.setFont(undefined, 'normal');
      pdf.text('Heure de départ', 20, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(formatTime(booking.trip.departure_time), 120, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      // Véhicule
      pdf.setFont(undefined, 'normal');
      pdf.text('Véhicule', 20, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${booking.trip.bus.brand} ${booking.trip.bus.model}`, 120, yPos);
      pdf.line(20, yPos + 5, 190, yPos + 5);
      yPos += 15;
      
      // Immatriculation
      pdf.setFont(undefined, 'normal');
      pdf.text('Immatriculation', 20, yPos);
      pdf.setFont(undefined, 'bold');
      pdf.text(booking.trip.bus.plate_number, 120, yPos);
      
      // Informations légales en bas
      pdf.setFontSize(7);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('GOMAROC Transport SA, société de transport de voyageurs,', 20, 270);
      pdf.text('dont le siège est situé au Maroc', 20, 278);
      
      pdf.save(`justificatif-voyage-${booking.booking_reference}.pdf`);
      
      toast({
        title: "Justificatif téléchargé !",
        description: "Votre justificatif de voyage a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le justificatif.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const sendEmailAgain = async () => {
    console.log('🔄 sendEmailAgain démarré', { booking, bookingRef });
    
    if (!booking || !bookingRef) {
      console.log('❌ Pas de booking ou bookingRef', { booking: !!booking, bookingRef });
      return;
    }
    
    setIsSendingEmail(true);
    try {
      console.log('📧 Appel fonction send-email-booking avec:', bookingRef);
      
      const { data, error } = await supabase.functions.invoke('send-email-booking', {
        body: { booking_reference: bookingRef }
      });

      console.log('📧 Résultat fonction:', { data, error });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé !",
        description: "L'email de confirmation a été renvoyé avec succès.",
      });
    } catch (error) {
      console.error('💥 Erreur envoi email:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer l'email de confirmation: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de votre réservation...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Réservation introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Aucune réservation trouvée avec cette référence.
            </p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* En-tête de confirmation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Réservation confirmée !</h1>
            <p className="text-muted-foreground text-lg">
              Votre voyage a été réservé avec succès
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Détails de la réservation */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de réservation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Détails de la réservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Référence</p>
                      <p className="font-mono text-lg font-semibold">{booking.booking_reference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date de réservation</p>
                      <p className="text-lg">{format(new Date(booking.created_at), 'PPP', { locale: fr })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <div className="mt-1">{getStatusBadge(booking.booking_status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Paiement</p>
                      <div className="mt-1">{getPaymentStatusBadge(booking.payment_status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du passager */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations du passager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.passenger_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.passenger_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.passenger_phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Détails du voyage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Détails du voyage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Horaires */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(booking.trip.departure_time)}</div>
                        <div className="text-sm text-muted-foreground">{booking.trip.route.origin.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(booking.trip.departure_time)}</div>
                      </div>
                      
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mb-1" />
                        <span className="text-sm">{formatDuration(booking.trip.route.duration_minutes)}</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(booking.trip.arrival_time)}</div>
                        <div className="text-sm text-muted-foreground">{booking.trip.route.destination.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(booking.trip.arrival_time)}</div>
                      </div>
                    </div>

                    {/* Informations du bus */}
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Véhicule</p>
                      <p className="font-medium">{booking.trip.bus.brand} {booking.trip.bus.model}</p>
                      <p className="text-sm text-muted-foreground">Immatriculation: {booking.trip.bus.plate_number}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions et récapitulatif */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Référence</span>
                      <span className="font-mono">{booking.booking_reference}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trajet</span>
                      <span className="font-medium">{booking.trip.route.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date</span>
                      <span>{formatDate(booking.trip.departure_time)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total payé</span>
                      <span>{booking.total_price}€</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={downloadTicket}
                      disabled={isDownloading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isDownloading ? 'Téléchargement...' : 'Télécharger le billet'}
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={sendEmailAgain}
                      disabled={isSendingEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {isSendingEmail ? 'Envoi...' : 'Envoyer par email'}
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                      Un email de confirmation a été envoyé à {booking.passenger_email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions supplémentaires */}
          <div className="mt-8 text-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/">Nouvelle recherche</Link>
            </Button>
            <Button asChild>
              <Link to="/booking-tracking">Suivre mes réservations</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingConfirmation;