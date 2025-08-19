import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const RecurringTripsManager = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [routesResponse, busesResponse] = await Promise.all([
        supabase.from('routes').select('*').eq('is_active', true),
        supabase.from('buses').select('*').eq('is_active', true)
      ]);

      if (routesResponse.data) setRoutes(routesResponse.data);
      if (busesResponse.data) setBuses(busesResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRecurringTrips = async (formData: FormData) => {
    try {
      const routeId = formData.get('recurring-route') as string;
      const busId = formData.get('recurring-bus') as string;
      const departureTime = formData.get('recurring-departure-time') as string;
      const arrivalTime = formData.get('recurring-arrival-time') as string;
      const price = formData.get('recurring-price') as string;
      const seats = formData.get('recurring-seats') as string;
      const frequency = formData.get('recurring-frequency') as string;
      const weeks = parseInt(formData.get('recurring-weeks') as string);
      const startDate = formData.get('recurring-start-date') as string;
      const notes = formData.get('recurring-notes') as string;

      if (!routeId || !busId || !departureTime || !arrivalTime || !price || !seats || !frequency || !startDate) {
        toast({
          title: "Erreur de validation",
          description: "Tous les champs obligatoires doivent être remplis",
          variant: "destructive",
        });
        return;
      }

      const trips = [];
      const start = new Date(startDate);
      
      // Calculer les dates selon la fréquence
      for (let week = 0; week < weeks; week++) {
        let currentDate = new Date(start);
        
        if (frequency === 'daily') {
          // Tous les jours de la semaine
          for (let day = 0; day < 7; day++) {
            currentDate = new Date(start);
            currentDate.setDate(start.getDate() + (week * 7) + day);
            trips.push(createTripData(currentDate, departureTime, arrivalTime, routeId, busId, price, seats, notes));
          }
        } else if (frequency === 'weekly') {
          // Même jour chaque semaine
          currentDate.setDate(start.getDate() + (week * 7));
          trips.push(createTripData(currentDate, departureTime, arrivalTime, routeId, busId, price, seats, notes));
        } else {
          // Jour spécifique de la semaine
          const dayMap = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
            'friday': 5, 'saturday': 6, 'sunday': 0
          };
          const targetDay = dayMap[frequency as keyof typeof dayMap];
          
          // Trouver le premier jour de la semaine correspondant
          let firstOccurrence = new Date(start);
          const dayDiff = targetDay - firstOccurrence.getDay();
          firstOccurrence.setDate(firstOccurrence.getDate() + dayDiff + (dayDiff < 0 ? 7 : 0));
          
          // Ajouter pour chaque semaine
          currentDate = new Date(firstOccurrence);
          currentDate.setDate(firstOccurrence.getDate() + (week * 7));
          trips.push(createTripData(currentDate, departureTime, arrivalTime, routeId, busId, price, seats, notes));
        }
      }

      // Insérer tous les voyages en une fois
      const { error } = await supabase
        .from('trips')
        .insert(trips);

      if (error) {
        console.error('Recurring trips creation error:', error);
        throw error;
      }
      
      toast({
        title: "Voyages récurrents créés",
        description: `${trips.length} voyages ont été programmés avec succès.`,
      });

      // Reset form
      (document.getElementById('recurring-form') as HTMLFormElement)?.reset();
    } catch (error) {
      console.error('Error creating recurring trips:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer les voyages récurrents.",
        variant: "destructive"
      });
    }
  };

  const createTripData = (date: Date, departureTime: string, arrivalTime: string, routeId: string, busId: string, price: string, seats: string, notes: string) => {
    const departureDateTime = new Date(`${date.toISOString().split('T')[0]}T${departureTime}`);
    const arrivalDateTime = new Date(`${date.toISOString().split('T')[0]}T${arrivalTime}`);
    
    return {
      route_id: routeId,
      bus_id: busId,
      departure_time: departureDateTime.toISOString(),
      arrival_time: arrivalDateTime.toISOString(),
      price: parseFloat(price),
      available_seats: parseInt(seats),
      special_notes: notes || null
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/admin" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            Créer des voyages récurrents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="recurring-form" onSubmit={(e) => {
            e.preventDefault();
            createRecurringTrips(new FormData(e.currentTarget));
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recurring-route">Route</Label>
                <Select name="recurring-route" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route: any) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recurring-bus">Bus</Label>
                <Select name="recurring-bus" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus: any) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.plate_number} - {bus.capacity} places
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recurring-departure-time">Heure de départ</Label>
                <Input
                  id="recurring-departure-time"
                  name="recurring-departure-time"
                  type="time"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurring-arrival-time">Heure d'arrivée</Label>
                <Input
                  id="recurring-arrival-time"
                  name="recurring-arrival-time"
                  type="time"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurring-price">Prix (€)</Label>
                <Input
                  id="recurring-price"
                  name="recurring-price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurring-seats">Places disponibles</Label>
                <Input
                  id="recurring-seats"
                  name="recurring-seats"
                  type="number"
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurring-frequency">Fréquence</Label>
                <Select name="recurring-frequency" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir la fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Tous les jours</SelectItem>
                    <SelectItem value="weekly">Toutes les semaines</SelectItem>
                    <SelectItem value="monday">Tous les lundis</SelectItem>
                    <SelectItem value="tuesday">Tous les mardis</SelectItem>
                    <SelectItem value="wednesday">Tous les mercredis</SelectItem>
                    <SelectItem value="thursday">Tous les jeudis</SelectItem>
                    <SelectItem value="friday">Tous les vendredis</SelectItem>
                    <SelectItem value="saturday">Tous les samedis</SelectItem>
                    <SelectItem value="sunday">Tous les dimanches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recurring-weeks">Nombre de semaines</Label>
                <Input
                  id="recurring-weeks"
                  name="recurring-weeks"
                  type="number"
                  min="1"
                  max="52"
                  defaultValue="4"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurring-start-date">Date de début</Label>
                <Input
                  id="recurring-start-date"
                  name="recurring-start-date"
                  type="date"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurring-notes">Notes spéciales</Label>
                <Input
                  id="recurring-notes"
                  name="recurring-notes"
                  placeholder="Instructions particulières..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Link to="/admin">
                <Button type="button" variant="outline">
                  Retour
                </Button>
              </Link>
              <Button type="submit">
                Créer les voyages récurrents
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringTripsManager;