import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Bus, Users, Star, Phone, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Trip {
  id: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  status: string;
  route: {
    id: string;
    name: string;
    origin: { name: string; code: string };
    destination: { name: string; code: string };
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

interface PassengerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  passport_number: string;
  date_of_birth: string;
  type: 'adult' | 'child';
}

interface ValidationError {
  field: string;
  message: string;
  passengerId?: string;
}

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
  });

  const tripId = searchParams.get("tripId");
  const adults = parseInt(searchParams.get("adults") || "1");
  const children = parseInt(searchParams.get("children") || "0");

  useEffect(() => {
    if (tripId) {
      loadTripDetails();
    }
    
    // Initialiser les passagers depuis l'URL
    const initialAdults = parseInt(searchParams.get("adults") || "1");
    const initialChildren = parseInt(searchParams.get("children") || "0");
    
    setFormData(prev => ({
      ...prev,
      adults: initialAdults,
      children: initialChildren
    }));
    
    // Créer la liste des passagers
    initializePassengers(initialAdults, initialChildren);
  }, [tripId]);

  const initializePassengers = (adults: number, children: number) => {
    const newPassengers: PassengerInfo[] = [];
    
    // Ajouter les adultes
    for (let i = 0; i < adults; i++) {
      newPassengers.push({
        id: `adult-${i}`,
        name: '',
        email: i === 0 ? '' : '', // Premier passager = contact principal
        phone: i === 0 ? '' : '',
        passport_number: '',
        date_of_birth: '',
        type: 'adult'
      });
    }
    
    // Ajouter les enfants
    for (let i = 0; i < children; i++) {
      newPassengers.push({
        id: `child-${i}`,
        name: '',
        email: '',
        phone: '',
        passport_number: '',
        date_of_birth: '',
        type: 'child'
      });
    }
    
    setPassengers(newPassengers);
  };

  const updatePassengerCount = (adults: number, children: number) => {
    setFormData(prev => ({ ...prev, adults, children }));
    initializePassengers(adults, children);
    setValidationErrors([]); // Reset validation errors
  };

  const validatePassportNumber = (passport: string): boolean => {
    // Format français: 2 lettres + 7 chiffres
    const frenchFormat = /^[A-Z]{2}\d{7}$/;
    // Format marocain: lettres et chiffres
    const moroccanFormat = /^[A-Z0-9]{6,9}$/;
    
    return frenchFormat.test(passport.toUpperCase()) || moroccanFormat.test(passport.toUpperCase());
  };

  const validateAge = (dateOfBirth: string, passengerType: 'adult' | 'child'): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= (passengerType === 'adult' ? 18 : 0) && age - 1 < (passengerType === 'adult' ? 120 : 18);
    }
    
    return age >= (passengerType === 'adult' ? 18 : 0) && age < (passengerType === 'adult' ? 120 : 18);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Format français ou marocain
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$|^(\+212|0)[1-9](\d{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassengers = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    passengers.forEach((passenger, index) => {
      const passengerLabel = `${passenger.type === 'adult' ? 'Adulte' : 'Enfant'} ${Math.floor(index / (passenger.type === 'adult' ? formData.adults : formData.children)) + 1}`;
      
      // Nom obligatoire
      if (!passenger.name.trim()) {
        errors.push({
          field: 'name',
          message: `Le nom est obligatoire pour ${passengerLabel}`,
          passengerId: passenger.id
        });
      }
      
      // Email obligatoire pour le contact principal (premier adulte)
      if (index === 0 && (!passenger.email.trim() || !validateEmail(passenger.email))) {
        errors.push({
          field: 'email',
          message: 'Un email valide est requis pour le contact principal',
          passengerId: passenger.id
        });
      }
      
      // Téléphone obligatoire pour le contact principal
      if (index === 0 && (!passenger.phone.trim() || !validatePhone(passenger.phone))) {
        errors.push({
          field: 'phone',
          message: 'Un numéro de téléphone valide est requis pour le contact principal',
          passengerId: passenger.id
        });
      }
      
      // Passeport obligatoire et format valide
      if (!passenger.passport_number.trim()) {
        errors.push({
          field: 'passport_number',
          message: `Le numéro de passeport est obligatoire pour ${passengerLabel}`,
          passengerId: passenger.id
        });
      } else if (!validatePassportNumber(passenger.passport_number)) {
        errors.push({
          field: 'passport_number',
          message: `Format de passeport invalide pour ${passengerLabel} (ex: AB1234567)`,
          passengerId: passenger.id
        });
      }
      
      // Date de naissance obligatoire et cohérente
      if (!passenger.date_of_birth) {
        errors.push({
          field: 'date_of_birth',
          message: `La date de naissance est obligatoire pour ${passengerLabel}`,
          passengerId: passenger.id
        });
      } else if (!validateAge(passenger.date_of_birth, passenger.type)) {
        errors.push({
          field: 'date_of_birth',
          message: `Âge incohérent pour ${passengerLabel} (${passenger.type === 'adult' ? '18+ ans requis' : 'moins de 18 ans requis'})`,
          passengerId: passenger.id
        });
      }
    });
    
    return errors;
  };

  const updatePassenger = (passengerId: string, field: keyof PassengerInfo, value: string) => {
    setPassengers(prev =>
      prev.map(p =>
        p.id === passengerId ? { ...p, [field]: value } : p
      )
    );
    
    // Supprimer les erreurs pour ce champ
    setValidationErrors(prev =>
      prev.filter(error => !(error.passengerId === passengerId && error.field === field))
    );
  };

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      
      // Récupérer les détails du voyage
      const { data: tripData, error: tripError } = await supabase
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
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // Récupérer les détails de la route
      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .select(`
          id,
          name,
          duration_minutes,
          origin_id,
          destination_id
        `)
        .eq('id', tripData.route_id)
        .single();

      if (routeError) throw routeError;

      // Récupérer les destinations
      const { data: originsData } = await supabase
        .from('destinations')
        .select('id, name, code')
        .eq('id', routeData.origin_id)
        .single();

      const { data: destinationsData } = await supabase
        .from('destinations')
        .select('id, name, code')
        .eq('id', routeData.destination_id)
        .single();

      // Récupérer les détails du bus
      const { data: busData, error: busError } = await supabase
        .from('buses')
        .select('model, brand, capacity, amenities, plate_number, company_name')
        .eq('id', tripData.bus_id)
        .single();

      if (busError) throw busError;

      // Construire l'objet trip
      const formattedTrip: Trip = {
        id: tripData.id,
        departure_time: tripData.departure_time,
        arrival_time: tripData.arrival_time,
        price: tripData.price,
        available_seats: tripData.available_seats,
        status: tripData.status,
        route: {
          id: routeData.id,
          name: routeData.name,
          origin: { name: originsData?.name || '', code: originsData?.code || '' },
          destination: { name: destinationsData?.name || '', code: destinationsData?.code || '' },
          duration_minutes: routeData.duration_minutes
        },
        bus: {
          model: busData.model || '',
          brand: busData.brand || '',
          capacity: busData.capacity,
          amenities: busData.amenities || [],
          plate_number: busData.plate_number || '',
          company_name: busData.company_name || 'Go Maroc'
        }
      };

      setTrip(formattedTrip);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du voyage",
        variant: "destructive",
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trip) return;
    
    // Validation
    const errors = validatePassengers();
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      toast({
        title: "Erreurs de validation",
        description: `${errors.length} erreur(s) détectée(s). Veuillez corriger les champs en rouge.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPassengers = formData.adults + formData.children;
      const totalPrice = trip.price * totalPassengers;

      console.log("🎫 Création réservation:", {
        totalPassengers,
        totalPrice,
        passengers: passengers.length
      });

      // Créer la réservation avec les infos du contact principal
      const mainContact = passengers[0];
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          trip_id: trip.id,
          passenger_name: mainContact.name,
          passenger_email: mainContact.email,
          passenger_phone: mainContact.phone,
          passport_number: mainContact.passport_number,
          date_of_birth: mainContact.date_of_birth,
          total_price: totalPrice,
          payment_status: 'pending',
          booking_status: 'pending',
          booking_reference: '',
          special_requests: `Passagers: ${passengers.map(p => `${p.name} (${p.passport_number})`).join(', ')}`
        } as any)
        .select()
        .single();

      if (bookingError) {
        console.error("❌ Erreur création réservation:", bookingError);
        throw bookingError;
      }

      console.log("✅ Réservation créée:", booking.booking_reference);

      toast({
        title: "Réservation créée !",
        description: `Référence: ${booking.booking_reference}. Redirection vers le paiement...`,
      });

      // Attendre un peu pour que l'utilisateur voie le message
      setTimeout(async () => {
        try {
          console.log("💳 Appel fonction paiement...");
          
          const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-checkout-session', {
            body: { booking_reference: booking.booking_reference }
          });

          console.log("💳 Réponse complète:", { data: paymentData, error: paymentError });

          if (paymentError) {
            console.error("❌ Erreur fonction paiement:", paymentError);
            toast({
              title: "Erreur de paiement",
              description: `Erreur: ${paymentError.message || 'Erreur inconnue'}`,
              variant: "destructive",
            });
            return;
          }

          if (!paymentData) {
            console.error("❌ Aucune donnée retournée");
            toast({
              title: "Erreur de paiement",
              description: "Aucune donnée de paiement retournée",
              variant: "destructive",
            });
            return;
          }

          if (paymentData.url) {
            console.log("🚀 Redirection vers Stripe:", paymentData.url);
            // Ouvrir dans un nouvel onglet pour éviter les problèmes de redirection
            window.open(paymentData.url, '_blank');
          } else {
            console.error("❌ URL manquante dans la réponse:", paymentData);
            toast({
              title: "Erreur de paiement",
              description: "URL de paiement non reçue. Données: " + JSON.stringify(paymentData),
              variant: "destructive",
            });
          }
        } catch (paymentError) {
          console.error("💥 Erreur paiement:", paymentError);
          toast({
            title: "Erreur de paiement",
            description: paymentError.message || "Impossible de créer la session de paiement. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }, 1000);

    } catch (error) {
      console.error("💥 Erreur générale:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des détails du voyage...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Voyage introuvable</h1>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPassengers = formData.adults + formData.children;
  const totalPrice = trip.price * totalPassengers;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* En-tête */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => {
                // Récupérer les paramètres de recherche depuis sessionStorage
                const savedSearch = sessionStorage.getItem('lastSearch');
                if (savedSearch) {
                  const searchData = JSON.parse(savedSearch);
                  const { from, to, date, adults, children } = searchData;
                  navigate(`/search-results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&adults=${adults}&children=${children}`);
                } else {
                  // Fallback vers la page d'accueil si pas de recherche sauvegardée
                  navigate('/');
                }
              }} 
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux résultats
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Réservation de voyage</h1>
            <p className="text-muted-foreground">
              {trip.route.origin.name} → {trip.route.destination.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Détails du voyage */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations du trajet */}
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
                        <div className="text-2xl font-bold">{formatTime(trip.departure_time)}</div>
                        <div className="text-sm text-muted-foreground">{trip.route.origin.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(trip.departure_time)}</div>
                      </div>
                      
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mb-1" />
                        <span className="text-sm">{formatDuration(Math.round((new Date(trip.arrival_time).getTime() - new Date(trip.departure_time).getTime()) / (1000 * 60)))}</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(trip.arrival_time)}</div>
                        <div className="text-sm text-muted-foreground">{trip.route.destination.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(trip.arrival_time)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du bus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="h-5 w-5" />
                    Informations du bus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Label className="text-sm font-medium">Société</Label>
                         <p className="text-lg font-semibold text-primary">{trip.bus.company_name}</p>
                       </div>
                       <div>
                         <Label className="text-sm font-medium">Véhicule</Label>
                         <p className="text-lg">{trip.bus.brand} {trip.bus.model}</p>
                       </div>
                       <div>
                         <Label className="text-sm font-medium">Immatriculation</Label>
                         <p className="text-lg">{trip.bus.plate_number || 'Non spécifiée'}</p>
                       </div>
                      <div>
                        <Label className="text-sm font-medium">Capacité</Label>
                        <p className="text-lg flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {trip.bus.capacity} places
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Places disponibles</Label>
                        <p className="text-lg font-semibold text-green-600">{trip.available_seats} places</p>
                      </div>
                    </div>
                    
                    {trip.bus.amenities.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Équipements</Label>
                        <div className="flex flex-wrap gap-2">
                          {trip.bus.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">{amenity}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Formulaire de réservation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations des passagers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Sélection du nombre de passagers */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <Label htmlFor="adults">Adultes (18+)</Label>
                        <Input
                          id="adults"
                          type="number"
                          min="1"
                          max="8"
                          value={formData.adults}
                          onChange={(e) => updatePassengerCount(parseInt(e.target.value) || 1, formData.children)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="children">Enfants (0-17)</Label>
                        <Input
                          id="children"
                          type="number"
                          min="0"
                          max="8"
                          value={formData.children}
                          onChange={(e) => updatePassengerCount(formData.adults, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Liste des passagers */}
                    <div className="space-y-6">
                      {passengers.map((passenger, index) => {
                        const isMainContact = index === 0;
                        const passengerErrors = validationErrors.filter(e => e.passengerId === passenger.id);
                        
                        return (
                          <Card key={passenger.id} className={`${isMainContact ? 'border-primary' : ''}`}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                {passenger.type === 'adult' ? '👤' : '🧒'} 
                                {passenger.type === 'adult' ? `Adulte ${Math.floor(index / formData.adults) + 1}` : `Enfant ${index - formData.adults + 1}`}
                                {isMainContact && <Badge variant="secondary">Contact principal</Badge>}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`${passenger.id}-name`}>
                                    Nom complet *
                                  </Label>
                                  <Input
                                    id={`${passenger.id}-name`}
                                    type="text"
                                    value={passenger.name}
                                    onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                                    placeholder="Jean Dupont"
                                    className={passengerErrors.some(e => e.field === 'name') ? 'border-destructive' : ''}
                                  />
                                  {passengerErrors.filter(e => e.field === 'name').map((error, i) => (
                                    <p key={i} className="text-sm text-destructive mt-1">{error.message}</p>
                                  ))}
                                </div>
                                
                                {isMainContact && (
                                  <div>
                                    <Label htmlFor={`${passenger.id}-phone`}>
                                      Téléphone *
                                    </Label>
                                    <Input
                                      id={`${passenger.id}-phone`}
                                      type="tel"
                                      value={passenger.phone}
                                      onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                                      placeholder="+33 6 12 34 56 78"
                                      className={passengerErrors.some(e => e.field === 'phone') ? 'border-destructive' : ''}
                                    />
                                    {passengerErrors.filter(e => e.field === 'phone').map((error, i) => (
                                      <p key={i} className="text-sm text-destructive mt-1">{error.message}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {isMainContact && (
                                <div>
                                  <Label htmlFor={`${passenger.id}-email`}>
                                    Email *
                                  </Label>
                                  <Input
                                    id={`${passenger.id}-email`}
                                    type="email"
                                    value={passenger.email}
                                    onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)}
                                    placeholder="jean.dupont@email.com"
                                    className={passengerErrors.some(e => e.field === 'email') ? 'border-destructive' : ''}
                                  />
                                  {passengerErrors.filter(e => e.field === 'email').map((error, i) => (
                                    <p key={i} className="text-sm text-destructive mt-1">{error.message}</p>
                                  ))}
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`${passenger.id}-passport`}>
                                    Numéro de passeport *
                                  </Label>
                                  <Input
                                    id={`${passenger.id}-passport`}
                                    value={passenger.passport_number}
                                    onChange={(e) => updatePassenger(passenger.id, 'passport_number', e.target.value.toUpperCase())}
                                    placeholder="AB1234567"
                                    className={passengerErrors.some(e => e.field === 'passport_number') ? 'border-destructive' : ''}
                                  />
                                  {passengerErrors.filter(e => e.field === 'passport_number').map((error, i) => (
                                    <p key={i} className="text-sm text-destructive mt-1">{error.message}</p>
                                  ))}
                                </div>
                                
                                <div>
                                  <Label htmlFor={`${passenger.id}-birth`}>
                                    Date de naissance *
                                  </Label>
                                  <Input
                                    id={`${passenger.id}-birth`}
                                    type="date"
                                    value={passenger.date_of_birth}
                                    onChange={(e) => updatePassenger(passenger.id, 'date_of_birth', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={passengerErrors.some(e => e.field === 'date_of_birth') ? 'border-destructive' : ''}
                                  />
                                  {passengerErrors.filter(e => e.field === 'date_of_birth').map((error, i) => (
                                    <p key={i} className="text-sm text-destructive mt-1">{error.message}</p>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trajet</span>
                      <span className="font-medium">{trip.route.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date</span>
                      <span>{formatDate(trip.departure_time)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Heure de départ</span>
                      <span>{formatTime(trip.departure_time)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Durée</span>
                      <span>{formatDuration(trip.route.duration_minutes)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prix par personne</span>
                      <span>{trip.price}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Passagers</span>
                      <span>{totalPassengers}</span>
                    </div>
                    {formData.adults > 0 && (
                      <div className="flex justify-between text-xs text-muted-foreground ml-4">
                        <span>Adultes</span>
                        <span>{formData.adults} × {trip.price}€</span>
                      </div>
                    )}
                    {formData.children > 0 && (
                      <div className="flex justify-between text-xs text-muted-foreground ml-4">
                        <span>Enfants</span>
                        <span>{formData.children} × {trip.price}€</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{totalPrice}€</span>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || validationErrors.length > 0 || passengers.some(p => !p.name.trim()) || totalPassengers > trip.available_seats}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Traitement..." : `Confirmer la réservation - ${totalPrice}€`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En confirmant, vous acceptez nos conditions générales de vente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPage;