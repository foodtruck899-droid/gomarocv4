import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Bus, MapPin, Calendar, Settings, Plus, Edit2, Trash2, Clock } from "lucide-react";
import { DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { Link } from "react-router-dom";
import { PageEditor } from "@/components/PageEditor";
import { RecurringTripsDialog } from "@/components/RecurringTripsDialog";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRoutes: 0,
    totalBuses: 0,
    revenue: 0
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [routeStops, setRouteStops] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [pageOrder, setPageOrder] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour contrôler l'ouverture des dialogs
  const [openDialogs, setOpenDialogs] = useState({
    destination: false,
    route: false,
    bus: false,
    trip: false,
    recurringTrip: false
  });

  // États pour l'édition
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const { toast } = useToast();

  // Fonction pour mettre à jour le contenu du site directement (inline editing)
  const updateSiteContentInline = async (contentId: string, newValue: string) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ value: newValue })
        .eq('id', contentId);

      if (error) {
        throw error;
      }

      // Recharger les données pour refléter les changements
      await loadDashboardData();
      
      toast({
        title: "Contenu mis à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Error updating site content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contenu.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour déplacer une section vers le haut
  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = pageOrder.findIndex(item => item.id === sectionId);
      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= pageOrder.length) return;

      // Échanger les ordres
      const newOrder = [...pageOrder];
      const currentItem = newOrder[currentIndex];
      const targetItem = newOrder[targetIndex];
      
      const currentData = JSON.parse(currentItem.value || '{}');
      const targetData = JSON.parse(targetItem.value || '{}');
      
      const tempOrder = currentData.order;
      currentData.order = targetData.order;
      targetData.order = tempOrder;

      // Mettre à jour en base de données
      await Promise.all([
        supabase.from('site_content').update({ 
          value: JSON.stringify(currentData) 
        }).eq('id', currentItem.id),
        supabase.from('site_content').update({ 
          value: JSON.stringify(targetData) 
        }).eq('id', targetItem.id)
      ]);

      // Recharger les données
      loadDashboardData();
      
      toast({
        title: "Ordre modifié",
        description: "L'ordre des sections a été mis à jour.",
      });
    } catch (error) {
      console.error('Erreur lors du changement d\'ordre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'ordre.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour activer/désactiver une section
  const toggleSection = async (sectionId: string) => {
    try {
      const section = pageOrder.find(item => item.id === sectionId);
      if (!section) return;

      const sectionData = JSON.parse(section.value || '{}');
      sectionData.enabled = !sectionData.enabled;

      const { error } = await supabase
        .from('site_content')
        .update({ value: JSON.stringify(sectionData) })
        .eq('id', sectionId);

      if (error) throw error;

      loadDashboardData();
      
      toast({
        title: "Section mise à jour",
        description: `Section ${sectionData.enabled ? 'activée' : 'désactivée'}.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'activation/désactivation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la section.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Loading dashboard data (removed console.log for production security)
      const [usersResult, bookingsResult, destinationsResult, routesResult, busesResult, tripsResult, contentResult] = await Promise.all([
        // Récupérer les profils avec les emails des utilisateurs depuis auth.users
        supabase.rpc('get_users_with_auth_data' as any),
        (supabase as any).from('bookings').select('*'),
        (supabase as any).from('destinations').select('*'),
        (supabase as any).from('routes').select('*, origin:destinations!routes_origin_id_fkey(name), destination:destinations!routes_destination_id_fkey(name)'),
        (supabase as any).from('buses').select('*'),
        (supabase as any).from('trips').select('*, routes(*, origin:destinations!routes_origin_id_fkey(name), destination:destinations!routes_destination_id_fkey(name)), buses(*)'),
        (supabase as any).from('site_content').select('*')
      ]);

      if (usersResult.error) {
        console.error('Erreur lors de la récupération des utilisateurs:', usersResult.error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs: " + usersResult.error.message,
          variant: "destructive",
        });
      } else if (usersResult.data) {
        setUsers(usersResult.data as any[]);
      }

      if (bookingsResult.data) setBookings(bookingsResult.data);
      if (destinationsResult.data) setDestinations(destinationsResult.data);
      if (routesResult.data) setRoutes(routesResult.data);
      if (busesResult.data) setBuses(busesResult.data);
      if (tripsResult.data) setTrips(tripsResult.data);
      if (contentResult.data) {
        setSiteContent(contentResult.data);
        // Charger l'ordre des pages
        const orderData = contentResult.data.filter(item => item.section === 'page_order');
        setPageOrder(orderData.sort((a, b) => {
          const orderA = JSON.parse(a.value || '{}').order || 0;
          const orderB = JSON.parse(b.value || '{}').order || 0;
          return orderA - orderB;
        }));
      }

      // Calculer les statistiques
      setStats({
        totalUsers: usersResult.data?.length || 0,
        totalBookings: bookingsResult.data?.length || 0,
        totalRoutes: routesResult.data?.length || 0,
        totalBuses: busesResult.data?.length || 0,
        revenue: bookingsResult.data?.reduce((sum, booking) => sum + parseFloat(booking.total_price || 0), 0) || 0
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données du dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDestination = async (formData: FormData) => {
    try {
      const name = formData.get('name') as string;
      const region = formData.get('region') as string || 'N/A';
      const country = formData.get('country') as string || 'Maroc';
      
      if (!name) {
        toast({
          title: "Erreur de validation",
          description: "Le nom de la destination est requis",
          variant: "destructive",
        });
        return;
      }

      // Générer un code unique en vérifiant s'il existe déjà
      let code = name.substring(0, 3).toUpperCase();
      const { data: existingDestination } = await supabase
        .from('destinations')
        .select('code')
        .eq('code', code)
        .single();

      // Si le code existe déjà, ajouter un nombre
      if (existingDestination) {
        let counter = 1;
        let newCode = `${code}${counter}`;
        
        while (true) {
          const { data: existing } = await supabase
            .from('destinations')
            .select('code')
            .eq('code', newCode)
            .single();
            
          if (!existing) {
            code = newCode;
            break;
          }
          counter++;
          newCode = `${code.substring(0, 3)}${counter}`;
        }
      }

      const { error } = await supabase
        .from('destinations')
        .insert({
          name: name,
          code: code,
          region: region,
          country: country,
        });

      if (error) {
        console.error('Destination creation error:', error);
        throw error;
      }

      setOpenDialogs({...openDialogs, destination: false});
      toast({
        title: "Succès",
        description: "Destination créée avec succès.",
      });
      await loadDashboardData(); // Attendre le rechargement
    } catch (error) {
      console.error('Destination creation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la destination. Ce nom existe peut-être déjà.",
        variant: "destructive",
      });
    }
  };

  const updateDestination = async (formData: FormData) => {
    try {
      const destinationId = formData.get('destination_id') as string;
      const { error } = await (supabase as any)
        .from('destinations')
        .update({
          name: formData.get('name') as string,
          region: formData.get('region') as string,
          country: formData.get('country') as string,
        })
        .eq('id', destinationId);

      if (error) {
        console.error('Destination update error:', error);
        throw error;
      }

      setOpenDialogs({...openDialogs, destination: false});
      toast({
        title: "Succès",
        description: "Destination modifiée avec succès.",
      });
      loadDashboardData();
    } catch (error) {
      console.error('Update destination error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la destination.",
        variant: "destructive",
      });
    }
  };

  const updateRoute = async (formData: FormData) => {
    try {
      const routeId = formData.get('route_id') as string;
      const originId = formData.get('origin_id') as string;
      const destinationId = formData.get('destination_id') as string;
      
      if (originId === destinationId) {
        toast({
          title: "Erreur de validation",
          description: "L'origine et la destination doivent être différentes",
          variant: "destructive"
        });
        return;
      }

      const { error } = await (supabase as any)
        .from('routes')
        .update({
          name: formData.get('name') as string,
          origin_id: originId,
          destination_id: destinationId,
          duration_minutes: parseInt(formData.get('duration') as string),
          base_price: parseFloat(formData.get('price') as string),
        })
        .eq('id', routeId);

      if (error) {
        console.error('Route update error:', error);
        throw error;
      }

      setOpenDialogs({...openDialogs, route: false});
      toast({
        title: "Succès",
        description: "Route modifiée avec succès.",
      });
      loadDashboardData();
    } catch (error) {
      console.error('Update route error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la route.",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (formData: FormData) => {
    try {
      const userId = formData.get('user_id') as string;
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: formData.get('full_name') as string,
          phone: formData.get('phone') as string,
          role: formData.get('role') as string,
        })
        .eq('id', userId);

      if (error) {
        console.error('User update error:', error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Utilisateur modifié avec succès.",
      });
      loadDashboardData();
    } catch (error) {
      console.error('Update user error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const createRoute = async (formData: FormData) => {
    try {
      const originId = formData.get('origin_id') as string;
      const destinationId = formData.get('destination_id') as string;
      const routeName = formData.get('name') as string;
      
      // Creating route (removed console.log for production security)
      
      // Validation stricte
      if (!originId || !destinationId || !routeName) {
        throw new Error('Tous les champs sont requis');
      }
      
      if (originId === destinationId) {
        toast({
          title: "Erreur de validation",
          description: "L'origine et la destination doivent être différentes",
          variant: "destructive"
        });
        return;
      }

      // Obtenir les noms des destinations pour le nom de route
      const originDest = destinations.find((d: any) => d.id === originId);
      const destDest = destinations.find((d: any) => d.id === destinationId);
      const autoName = originDest && destDest ? `${originDest.name} → ${destDest.name}` : routeName;
      
      // Créer la route principale
      const { data: routeData, error: routeError } = await (supabase as any)
        .from('routes')
        .insert({
          name: autoName,
          origin_id: originId,
          destination_id: destinationId,
          duration_minutes: parseInt(formData.get('duration') as string),
          base_price: parseFloat(formData.get('price') as string),
        })
        .select()
        .single();

      if (routeError) {
        console.error('Route creation error:', routeError);
        throw routeError;
      }

      // Ajouter les arrêts s'il y en a
      if (routeStops.length > 0) {
        const stopsToInsert = routeStops.map((stop, index) => ({
          route_id: routeData.id,
          destination_id: stop.destination_id,
          stop_order: index + 1,
          departure_time: stop.departure_time,
          arrival_time: stop.arrival_time,
          is_final_destination: index === routeStops.length - 1
        }));

        const { error: stopsError } = await (supabase as any)
          .from('route_stops')
          .insert(stopsToInsert);

        if (stopsError) throw stopsError;
      }

      setOpenDialogs({...openDialogs, route: false});
      toast({
        title: "Succès",
        description: "Route avec arrêts créée avec succès.",
      });
      setRouteStops([]); // Reset les arrêts
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la route.",
        variant: "destructive",
      });
    }
  };

  const addRouteStop = () => {
    setRouteStops([...routeStops, {
      destination_id: '',
      departure_time: '',
      arrival_time: '',
      duration_from_start: 0,
      price_from_origin: 0
    }]);
  };

  const removeRouteStop = (index: number) => {
    setRouteStops(routeStops.filter((_, i) => i !== index));
  };

  const updateRouteStop = (index: number, field: string, value: string) => {
    const updated = [...routeStops];
    updated[index][field] = value;
    setRouteStops(updated);
  };

  const createBus = async (formData: FormData) => {
    try {
      // Creating bus (removed console.log for production security)
      
      const { error } = await (supabase as any)
        .from('buses')
        .insert({
          plate_number: formData.get('plate_number'),
          capacity: parseInt(formData.get('capacity') as string),
          model: formData.get('model'),
          brand: formData.get('brand'),
          amenities: [],
          driver_phone: formData.get('driver_phone')
        });

      if (error) {
        console.error('Bus creation error:', error);
        throw error;
      }
      setOpenDialogs({...openDialogs, bus: false});
      loadDashboardData();
      toast({
        title: "Bus ajouté",
        description: "Le bus a été ajouté avec succès.",
      });
    } catch (error) {
      console.error('Error creating bus:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le bus.",
        variant: "destructive"
      });
    }
  };

  const updateBus = async (formData: FormData) => {
    try {
      const busId = formData.get('bus_id') as string;
      const { error } = await (supabase as any)
        .from('buses')
        .update({
          plate_number: formData.get('plate_number'),
          capacity: parseInt(formData.get('capacity') as string),
          model: formData.get('model'),
          brand: formData.get('brand'),
          driver_phone: formData.get('driver_phone')
        })
        .eq('id', busId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Bus modifié",
        description: "Le bus a été modifié avec succès.",
      });
    } catch (error) {
      console.error('Error updating bus:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le bus.",
        variant: "destructive"
      });
    }
  };

  const deleteDestination = async (destinationId: string) => {
    try {
      // Vérifier d'abord s'il y a des routes utilisant cette destination
      const { data: routes } = await supabase
        .from('routes')
        .select('id')
        .or(`origin_id.eq.${destinationId},destination_id.eq.${destinationId}`);

      if (routes && routes.length > 0) {
        toast({
          title: "Impossible de supprimer",
          description: "Cette destination est utilisée dans des routes existantes. Supprimez d'abord les routes.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', destinationId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Destination supprimée",
        description: "La destination a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la destination.",
        variant: "destructive"
      });
    }
  };

  const deleteRoute = async (routeId: string) => {
    try {
      // Vérifier d'abord s'il y a des voyages programmés sur cette route
      const { data: trips } = await supabase
        .from('trips')
        .select('id')
        .eq('route_id', routeId)
        .eq('status', 'scheduled');

      if (trips && trips.length > 0) {
        toast({
          title: "Impossible de supprimer",
          description: "Cette route a des voyages programmés. Supprimez d'abord les voyages.",
          variant: "destructive"
        });
        return;
      }

      // Supprimer d'abord les arrêts de route
      await supabase
        .from('route_stops')
        .delete()
        .eq('route_id', routeId);

      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', routeId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Route supprimée",
        description: "La route a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la route.",
        variant: "destructive"
      });
    }
  };

  const deleteBus = async (busId: string) => {
    try {
      // Vérifier d'abord s'il y a des voyages programmés avec ce bus
      const { data: trips } = await supabase
        .from('trips')
        .select('id')
        .eq('bus_id', busId)
        .eq('status', 'scheduled');

      if (trips && trips.length > 0) {
        toast({
          title: "Impossible de supprimer",
          description: "Ce bus a des voyages programmés. Supprimez d'abord les voyages.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('buses')
        .delete()
        .eq('id', busId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Bus supprimé",
        description: "Le bus a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bus.",
        variant: "destructive"
      });
    }
  };

  const createTrip = async (formData: FormData) => {
    try {
      const routeId = formData.get('route_id') as string;
      const busId = formData.get('bus_id') as string;
      const departureDate = formData.get('departure_date') as string;
      const departureTime = formData.get('departure_time') as string;
      const arrivalTime = formData.get('arrival_time') as string;
      const price = formData.get('price') as string;

      if (!routeId || !busId || !departureDate || !departureTime || !arrivalTime || !price) {
        toast({
          title: "Erreur de validation",
          description: "Tous les champs sont requis",
          variant: "destructive",
        });
        return;
      }

      const selectedBus = buses.find((bus: any) => bus.id === busId);
      const departureDateTime = new Date(`${departureDate}T${departureTime}`);
      const arrivalDateTime = new Date(`${departureDate}T${arrivalTime}`);
      
      const { error } = await supabase
        .from('trips')
        .insert({
          route_id: routeId,
          bus_id: busId,
          departure_time: departureDateTime.toISOString(),
          arrival_time: arrivalDateTime.toISOString(),
          price: parseFloat(price),
          available_seats: selectedBus?.capacity || 0
        });

      if (error) {
        console.error('Trip creation error:', error);
        throw error;
      }
      
      setOpenDialogs({...openDialogs, trip: false});
      toast({
        title: "Voyage programmé",
        description: "Le voyage a été programmé avec succès.",
      });
      await loadDashboardData(); // Attendre le rechargement
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de programmer le voyage.",
        variant: "destructive"
      });
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
      
      setOpenDialogs({...openDialogs, recurringTrip: false});
      toast({
        title: "Voyages récurrents créés",
        description: `${trips.length} voyages ont été programmés avec succès.`,
      });
      await loadDashboardData();
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

  const updateTrip = async (formData: FormData) => {
    try {
      const tripId = formData.get('trip_id') as string;
      const departureDateTime = new Date(`${formData.get('departure_date')}T${formData.get('departure_time')}`);
      const arrivalDateTime = new Date(`${formData.get('departure_date')}T${formData.get('arrival_time')}`);
      
      const { error } = await (supabase as any)
        .from('trips')
        .update({
          route_id: formData.get('route_id'),
          bus_id: formData.get('bus_id'),
          departure_time: departureDateTime.toISOString(),
          arrival_time: arrivalDateTime.toISOString(),
          price: parseFloat(formData.get('price') as string)
        })
        .eq('id', tripId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Voyage modifié",
        description: "Le voyage a été modifié avec succès.",
      });
    } catch (error) {
      console.error('Error updating trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le voyage.",
        variant: "destructive"
      });
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      // Vérifier d'abord s'il y a des réservations pour ce voyage
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('trip_id', tripId);

      if (bookings && bookings.length > 0) {
        toast({
          title: "Impossible de supprimer",
          description: "Ce voyage a des réservations actives. Annulez d'abord les réservations.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
      
      loadDashboardData();
      toast({
        title: "Voyage supprimé",
        description: "Le voyage a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le voyage.",
        variant: "destructive"
      });
    }
  };

  const updateSiteContent = async (formData: FormData) => {
    try {
      const section = formData.get('section') as string;
      const key = formData.get('key') as string;
      const value = formData.get('value') as string;

      // Vérifier si l'enregistrement existe
      const { data: existingContent } = await (supabase as any)
        .from('site_content')
        .select('id')
        .eq('section', section)
        .eq('key', key)
        .single();

      let error;

      if (existingContent) {
        // Mettre à jour l'enregistrement existant
        const updateResult = await (supabase as any)
          .from('site_content')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('section', section)
          .eq('key', key);
        error = updateResult.error;
      } else {
        // Créer un nouvel enregistrement
        const insertResult = await (supabase as any)
          .from('site_content')
          .insert({
            section,
            key,
            value,
            content_type: 'text'
          });
        error = insertResult.error;
      }

      if (error) throw error;
      
      await loadDashboardData();
      toast({
        title: "Contenu modifié",
        description: "Le contenu du site a été modifié avec succès.",
      });
    } catch (error) {
      console.error('Error updating site content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le contenu.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
            Dashboard Admin - Go Maroc
          </Link>
          <Badge variant="default" className="bg-gradient-to-r from-primary to-accent">
            Administrateur
          </Badge>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total inscrits</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Routes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalRoutes}</div>
              <p className="text-xs text-muted-foreground">Actives</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bus</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalBuses}</div>
              <p className="text-xs text-muted-foreground">Flotte totale</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.revenue.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Gestion du système */}
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto gap-1 justify-start md:grid md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="buses">Bus</TabsTrigger>
            <TabsTrigger value="trips">Voyages</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="popular-destinations">Dest. Pop.</TabsTrigger>
            <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
            <TabsTrigger value="page-order">Ordre</TabsTrigger>
          </TabsList>

          {/* Gestion des destinations */}
          <TabsContent value="destinations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des destinations</CardTitle>
                <Dialog open={openDialogs.destination} onOpenChange={(open) => setOpenDialogs({...openDialogs, destination: open})}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une destination
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle destination</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      createDestination(new FormData(e.currentTarget));
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom de la destination</Label>
                        <Input id="name" name="name" placeholder="Ex: Gare de Casablanca" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Région</Label>
                        <Input id="region" name="region" placeholder="Ex: Grand Casablanca" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Select name="country" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Maroc">Maroc</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                        Créer la destination
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Région</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {destinations.map((destination: any) => (
                      <TableRow key={destination.id}>
                        <TableCell className="font-medium">{destination.name}</TableCell>
                        <TableCell>{destination.region}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {destination.country === 'Maroc' ? '🇲🇦' : '🇫🇷'} {destination.country}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={destination.is_active ? 'default' : 'secondary'}>
                            {destination.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingDestination(destination)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier la destination</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  updateDestination(new FormData(e.currentTarget));
                                }} className="space-y-4">
                                  <input type="hidden" name="destination_id" value={editingDestination?.id} />
                                  <div>
                                    <Label htmlFor="edit_name">Nom de la destination</Label>
                                    <Input id="edit_name" name="name" defaultValue={editingDestination?.name} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_region">Région</Label>
                                    <Input id="edit_region" name="region" defaultValue={editingDestination?.region} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_country">Pays</Label>
                                    <Select name="country" defaultValue={editingDestination?.country}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Maroc">Maroc</SelectItem>
                                        <SelectItem value="France">France</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button type="submit" className="w-full">Modifier la destination</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => deleteDestination(destination.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des routes */}
          <TabsContent value="routes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des routes</CardTitle>
                <Dialog open={openDialogs.route} onOpenChange={(open) => setOpenDialogs({...openDialogs, route: open})}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une route
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nouvelle route</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      createRoute(new FormData(e.currentTarget));
                    }} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom de la route</Label>
                        <Input id="name" name="name" placeholder="Ex: Casablanca → Marrakech" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Destination de départ</Label>
                          <Select name="origin_id" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le départ" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinations.map((dest: any) => (
                                <SelectItem key={dest.id} value={dest.id}>
                                  {dest.name} ({dest.region}, {dest.country})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Destination finale</Label>
                          <Select name="destination_id" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez l'arrivée finale" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinations.map((dest: any) => (
                                <SelectItem key={dest.id} value={dest.id}>
                                  {dest.name} ({dest.region}, {dest.country})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée totale (minutes)</Label>
                          <Input id="duration" name="duration" type="number" placeholder="Ex: 120" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix de base (€)</Label>
                          <Input id="price" name="price" type="number" step="0.01" placeholder="Ex: 150.00" required />
                        </div>
                      </div>

                      {/* Section des arrêts intermédiaires */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <Label className="text-lg font-semibold">Arrêts intermédiaires (optionnel)</Label>
                          <Button type="button" onClick={addRouteStop} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un arrêt
                          </Button>
                        </div>
                        
                        {routeStops.map((stop, index) => (
                          <div key={index} className="grid grid-cols-5 gap-2 mb-3 p-3 border rounded-lg">
                            <div>
                              <Label>Ville d'arrêt</Label>
                              <Select
                                value={stop.destination_id}
                                onValueChange={(value) => updateRouteStop(index, 'destination_id', value)}
                                required
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  {destinations.map((dest: any) => (
                                    <SelectItem key={dest.id} value={dest.id}>
                                      {dest.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Heure d'arrivée</Label>
                              <Input
                                type="time"
                                value={stop.arrival_time}
                                onChange={(e) => updateRouteStop(index, 'arrival_time', e.target.value)}
                                className="text-sm"
                                required
                              />
                            </div>
                            <div>
                              <Label>Heure de départ</Label>
                              <Input
                                type="time"
                                value={stop.departure_time}
                                onChange={(e) => updateRouteStop(index, 'departure_time', e.target.value)}
                                className="text-sm"
                                required
                              />
                            </div>
                            <div className="flex items-center">
                              <Label className="text-xs text-muted-foreground">
                                Arrêt #{index + 1}
                              </Label>
                            </div>
                            <div className="flex items-end">
                              <Button
                                type="button"
                                onClick={() => removeRouteStop(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {routeStops.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div className="text-sm text-blue-800">
                                <strong>Ordre des arrêts :</strong> Le bus partira de la destination de départ, 
                                s'arrêtera dans l'ordre des arrêts que vous avez ajoutés, puis arrivera à la destination finale.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                        Créer la route
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Départ</TableHead>
                      <TableHead>Arrivée</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.slice(0, 10).map((route: any) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">
                          {route.origin?.name}
                        </TableCell>
                        <TableCell>{route.destination?.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.round(route.duration_minutes / 60)}h</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{route.base_price}€</TableCell>
                        <TableCell>
                          <Badge variant={route.is_active ? 'default' : 'secondary'}>
                            {route.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingRoute(route)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier la route</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  updateRoute(new FormData(e.currentTarget));
                                }} className="space-y-4">
                                  <input type="hidden" name="route_id" value={editingRoute?.id} />
                                  <div>
                                    <Label htmlFor="edit_route_name">Nom de la route</Label>
                                    <Input id="edit_route_name" name="name" defaultValue={editingRoute?.name} required />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Origine</Label>
                                      <Select name="origin_id" defaultValue={editingRoute?.origin_id}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {destinations.map((dest: any) => (
                                            <SelectItem key={dest.id} value={dest.id}>
                                              {dest.name} ({dest.region})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Destination</Label>
                                      <Select name="destination_id" defaultValue={editingRoute?.destination_id}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {destinations.map((dest: any) => (
                                            <SelectItem key={dest.id} value={dest.id}>
                                              {dest.name} ({dest.region})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_duration">Durée (minutes)</Label>
                                      <Input id="edit_duration" name="duration" type="number" defaultValue={editingRoute?.duration_minutes} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_price">Prix (€)</Label>
                                      <Input id="edit_price" name="price" type="number" step="0.01" defaultValue={editingRoute?.base_price} required />
                                    </div>
                                  </div>
                                  <Button type="submit" className="w-full">Modifier la route</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => deleteRoute(route.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Autres tabs (buses, trips, etc.) seront implémentés de la même manière */}
          <TabsContent value="buses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion de la flotte de bus</CardTitle>
                  <Dialog open={openDialogs.bus} onOpenChange={(open) => setOpenDialogs({...openDialogs, bus: open})}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un bus
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un nouveau bus</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createBus(new FormData(e.currentTarget));
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="plate_number">Numéro de plaque</Label>
                          <Input id="plate_number" name="plate_number" required />
                        </div>
                        <div>
                          <Label htmlFor="capacity">Capacité</Label>
                          <Input id="capacity" name="capacity" type="number" required />
                        </div>
                        <div>
                          <Label htmlFor="brand">Marque</Label>
                          <Input id="brand" name="brand" required />
                        </div>
                        <div>
                          <Label htmlFor="company_name">Société</Label>
                          <Input id="company_name" name="company_name" defaultValue="Go Maroc" required />
                        </div>
                        <div>
                          <Label htmlFor="model">Modèle</Label>
                          <Input id="model" name="model" required />
                        </div>
                        <div>
                          <Label htmlFor="driver_phone">Téléphone conducteur</Label>
                          <Input id="driver_phone" name="driver_phone" placeholder="Numéro de téléphone du conducteur" />
                        </div>
                        <Button type="submit" className="w-full">Ajouter le bus</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plaque</TableHead>
                      <TableHead>Société</TableHead>
                      <TableHead>Marque/Modèle</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Téléphone conducteur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buses.map((bus: any) => (
                      <TableRow key={bus.id}>
                        <TableCell className="font-medium">{bus.plate_number}</TableCell>
                        <TableCell>{bus.company_name || 'Go Maroc'}</TableCell>
                        <TableCell>{bus.brand} {bus.model}</TableCell>
                        <TableCell>{bus.capacity}</TableCell>
                        <TableCell>{bus.driver_phone || 'Non renseigné'}</TableCell>
                        <TableCell>
                          <Badge variant={bus.is_active ? 'default' : 'secondary'}>
                            {bus.is_active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier le bus</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  updateBus(new FormData(e.currentTarget));
                                }} className="space-y-4">
                                  <input type="hidden" name="bus_id" value={bus.id} />
                                  <div>
                                    <Label htmlFor="edit_plate_number">Numéro de plaque</Label>
                                    <Input id="edit_plate_number" name="plate_number" defaultValue={bus.plate_number} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_capacity">Capacité</Label>
                                    <Input id="edit_capacity" name="capacity" type="number" defaultValue={bus.capacity} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_brand">Marque</Label>
                                    <Input id="edit_brand" name="brand" defaultValue={bus.brand || ''} required />
                                   </div>
                                   <div>
                                     <Label htmlFor="edit_company_name">Société</Label>
                                     <Input id="edit_company_name" name="company_name" defaultValue={bus.company_name || 'Go Maroc'} required />
                                   </div>
                                  <div>
                                    <Label htmlFor="edit_model">Modèle</Label>
                                    <Input id="edit_model" name="model" defaultValue={bus.model} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_driver_phone">Téléphone conducteur</Label>
                                    <Input id="edit_driver_phone" name="driver_phone" defaultValue={bus.driver_phone || ''} placeholder="Numéro de téléphone du conducteur" />
                                  </div>
                                  <Button type="submit" className="w-full">Modifier le bus</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => deleteBus(bus.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des voyages programmés</CardTitle>
                  <div className="flex gap-2">
                    <Dialog open={openDialogs.recurringTrip} onOpenChange={(open) => setOpenDialogs({...openDialogs, recurringTrip: open})}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Voyages récurrents
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Créer des voyages récurrents</DialogTitle>
                          <DialogDescription>
                            Programmez automatiquement des voyages qui se répètent selon un planning défini
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
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
                                  {routes.map((route) => (
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
                                  {buses.map((bus) => (
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
                            <Button type="button" variant="outline" onClick={() => setOpenDialogs({...openDialogs, recurringTrip: false})}>
                              Annuler
                            </Button>
                            <Button type="submit">
                              Créer les voyages récurrents
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={openDialogs.trip} onOpenChange={(open) => setOpenDialogs({...openDialogs, trip: open})}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Programmer un voyage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Programmer un nouveau voyage</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          createTrip(new FormData(e.currentTarget));
                        }}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="route_id">Route</Label>
                              <Select name="route_id" required>
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
                              <Label htmlFor="bus_id">Bus</Label>
                              <Select name="bus_id" required>
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
                              <Label htmlFor="departure_date">Date de départ</Label>
                              <Input
                                id="departure_date"
                                name="departure_date"
                                type="date"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="departure_time">Heure de départ</Label>
                              <Input
                                id="departure_time"
                                name="departure_time"
                                type="time"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="arrival_time">Heure d'arrivée</Label>
                              <Input
                                id="arrival_time"
                                name="arrival_time"
                                type="time"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="price">Prix (€)</Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => setOpenDialogs({...openDialogs, trip: false})}>
                              Annuler
                            </Button>
                            <Button type="submit">
                              Programmer le voyage
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Bus</TableHead>
                      <TableHead>Conducteur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Départ</TableHead>
                      <TableHead>Arrivée</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Places</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip: any) => (
                      <TableRow key={trip.id}>
                        <TableCell>
                          {trip.routes?.origin?.name} → {trip.routes?.destination?.name}
                        </TableCell>
                        <TableCell>{trip.buses?.plate_number}</TableCell>
                        <TableCell>{trip.buses?.driver_phone || 'Non renseigné'}</TableCell>
                        <TableCell>{new Date(trip.departure_time).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(trip.departure_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                        <TableCell>{new Date(trip.arrival_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                        <TableCell>{trip.price}€</TableCell>
                        <TableCell>{trip.available_seats}/{trip.buses?.capacity}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Modifier le voyage</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  updateTrip(new FormData(e.currentTarget));
                                }} className="space-y-4">
                                  <input type="hidden" name="trip_id" value={trip.id} />
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit_route_id">Route</Label>
                                      <select id="edit_route_id" name="route_id" defaultValue={trip.route_id} required className="w-full rounded-md border border-input bg-background px-3 py-2">
                                        {routes.map((route: any) => (
                                          <option key={route.id} value={route.id}>
                                            {route.origin?.name} → {route.destination?.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_bus_id">Bus</Label>
                                      <select id="edit_bus_id" name="bus_id" defaultValue={trip.bus_id} required className="w-full rounded-md border border-input bg-background px-3 py-2">
                                        {buses.filter((bus: any) => bus.status === 'active').map((bus: any) => (
                                          <option key={bus.id} value={bus.id}>
                                            {bus.plate_number} - {bus.model}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_departure_date">Date de départ</Label>
                                      <Input id="edit_departure_date" name="departure_date" type="date" defaultValue={trip.departure_date} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_arrival_time">Heure d'arrivée</Label>
                                      <Input id="edit_arrival_time" name="arrival_time" type="time" defaultValue={trip.arrival_time} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_departure_time">Heure de départ</Label>
                                      <Input id="edit_departure_time" name="departure_time" type="time" defaultValue={trip.departure_time} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_price">Prix (€)</Label>
                                      <Input id="edit_price" name="price" type="number" step="0.01" defaultValue={trip.price} required />
                                    </div>
                                  </div>
                                  <Button type="submit" className="w-full">Modifier le voyage</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => deleteTrip(trip.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {bookings.slice(0, 10).map((booking: any) => (
                       <TableRow key={booking.id}>
                         <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                         <TableCell>Client #{booking.user_id?.slice(0, 8) || 'N/A'}</TableCell>
                        <TableCell>
                          Route inconnue
                        </TableCell>
                        <TableCell>{new Date(booking.departure_date).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.total_price}€</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Statut Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                        <TableCell className="font-mono text-sm">{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={user.email_confirmed_at ? 'default' : 'destructive'} className="text-xs">
                            {user.email_confirmed_at ? '✓ Vérifié' : '✗ Non vérifié'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier l'utilisateur</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  updateUser(new FormData(e.currentTarget));
                                }} className="space-y-4">
                                  <input type="hidden" name="user_id" value={editingUser?.id} />
                                  <div>
                                    <Label htmlFor="edit_full_name">Nom complet</Label>
                                    <Input id="edit_full_name" name="full_name" defaultValue={editingUser?.full_name || ''} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_phone">Téléphone</Label>
                                    <Input id="edit_phone" name="phone" defaultValue={editingUser?.phone || ''} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit_role">Rôle</Label>
                                    <Select name="role" defaultValue={editingUser?.role}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user">Utilisateur</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button type="submit" className="w-full">Modifier l'utilisateur</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => deleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des pages */}
          <TabsContent value="pages">
            <PageEditor />
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du contenu du site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Page d'accueil */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Page d'accueil</h3>
                    {['header', 'hero', 'features', 'stats', 'footer', 'contact', 'seo'].map((sectionKey) => {
                    const sectionItems = siteContent.filter((item: any) => item.section === sectionKey);
                    if (sectionItems.length === 0) return null;
                    
                    // Noms affichés pour chaque section
                      const sectionNames: Record<string, string> = {
                        header: 'Navigation et menu',
                        hero: 'Section principale',
                        features: 'Fonctionnalités',
                        stats: 'Statistiques',
                        footer: 'Pied de page',
                        contact: 'Formulaire de contact',
                        seo: 'SEO et référencement'
                      };
                    
                    // Traductions des clés en français
                    const getKeyTranslation = (key: string) => {
                      const translations: Record<string, string> = {
                        // Header
                        organize_trip: 'Organiser votre voyage',
                        organize_trip_search: 'Rechercher',
                        organize_trip_schedules: 'Horaires',
                        organize_trip_destinations: 'Destinations',
                        services: 'Services',
                        services_baggage: 'Bagages',
                        services_assistance: 'Assistance',
                        services_premium: 'Premium',
                        track_journey: 'Suivre votre trajet',
                        help: 'Aide',
                        help_faq: 'FAQ',
                        help_contact: 'Contact',
                        help_terms: 'Conditions',
                        // Contact
                        form_title: 'Titre du formulaire',
                        form_description: 'Description du formulaire',
                        name_label: 'Libellé nom',
                        email_label: 'Libellé email',
                        subject_label: 'Libellé sujet',
                        message_label: 'Libellé message',
                        submit_button: 'Bouton d\'envoi',
                        // Hero
                        title: 'Titre',
                        subtitle: 'Sous-titre',
                        description: 'Description',
                        cta_button: 'Bouton d\'action',
                        // Features
                        feature1_title: 'Titre fonctionnalité 1',
                        feature1_description: 'Description fonctionnalité 1',
                        feature2_title: 'Titre fonctionnalité 2',
                        feature2_description: 'Description fonctionnalité 2',
                        feature3_title: 'Titre fonctionnalité 3',
                        feature3_description: 'Description fonctionnalité 3',
                        // Stats
                        main_title: 'Titre principal',
                        destinations_number: 'Nombre de destinations',
                        destinations_label: 'Libellé destinations',
                        countries_number: 'Nombre de pays',
                        countries_label: 'Libellé pays',
                        clients_number: 'Nombre de clients',
                        clients_label: 'Libellé clients',
                        year_number: 'Année',
                        year_label: 'Libellé année',
                        // Footer
                        section_company_title: 'Titre section entreprise',
                        company_about: 'À propos',
                        company_about_url: 'Lien à propos',
                        company_careers: 'Carrières',
                        company_careers_url: 'Lien carrières',
                        company_press: 'Presse',
                        company_press_url: 'Lien presse',
                        company_giftcards: 'Cartes cadeaux',
                        company_giftcards_url: 'Lien cartes cadeaux',
                        section_travel_title: 'Titre section voyage',
                        travel_routes: 'Routes',
                        travel_routes_url: 'Lien routes',
                        travel_stations: 'Gares',
                        travel_stations_url: 'Lien gares',
                        travel_app: 'Application',
                        travel_app_url: 'Lien application',
                        travel_groups: 'Groupes',
                        travel_groups_url: 'Lien groupes',
                        section_service_title: 'Titre section service',
                        service_help: 'Aide',
                        service_help_url: 'Lien aide',
                        service_booking: 'Réservation',
                        service_booking_url: 'Lien réservation',
                        service_tracking: 'Suivi',
                        service_tracking_url: 'Lien suivi',
                        service_contact: 'Contact',
                        service_contact_url: 'Lien contact',
                        section_legal_title: 'Titre section légale',
                        legal_terms: 'Conditions générales',
                        legal_terms_url: 'Lien conditions générales',
                        legal_privacy: 'Confidentialité',
                        legal_privacy_url: 'Lien confidentialité',
                        legal_mentions: 'Mentions légales',
                        legal_mentions_url: 'Lien mentions légales',
                        legal_cookies: 'Cookies',
                        legal_cookies_url: 'Lien cookies',
                        copyright: 'Copyright'
                      };
                      return translations[key] || key.replace(/_/g, ' ');
                    };
                    
                    // Ordre spécifique pour chaque section
                    const getOrder = (section: string, key: string) => {
                      const orders: Record<string, Record<string, number>> = {
                        header: { 
                          organize_trip: 1, organize_trip_search: 2, organize_trip_schedules: 3, organize_trip_destinations: 4,
                          services: 5, services_baggage: 6, services_assistance: 7, services_premium: 8,
                          track_journey: 9,
                          help: 10, help_faq: 11, help_contact: 12, help_terms: 13
                        },
                        contact: { form_title: 1, form_description: 2, name_label: 3, email_label: 4, subject_label: 5, message_label: 6, submit_button: 7 },
                        hero: { title: 1, subtitle: 2, description: 3, cta_button: 4 },
                        features: { title: 1, feature1_title: 2, feature1_description: 3, feature2_title: 4, feature2_description: 5, feature3_title: 6, feature3_description: 7 },
                        stats: { main_title: 1, destinations_number: 2, destinations_label: 3, countries_number: 4, countries_label: 5, clients_number: 6, clients_label: 7, year_number: 8, year_label: 9 },
                        footer: { 
                          section_company_title: 1, company_about: 2, company_about_url: 3, company_careers: 4, company_careers_url: 5, company_press: 6, company_press_url: 7, company_giftcards: 8, company_giftcards_url: 9,
                          section_travel_title: 10, travel_routes: 11, travel_routes_url: 12, travel_stations: 13, travel_stations_url: 14, travel_app: 15, travel_app_url: 16, travel_groups: 17, travel_groups_url: 18,
                          section_service_title: 19, service_help: 20, service_help_url: 21, service_booking: 22, service_booking_url: 23, service_tracking: 24, service_tracking_url: 25, service_contact: 26, service_contact_url: 27,
                          section_legal_title: 28, legal_terms: 29, legal_terms_url: 30, legal_privacy: 31, legal_privacy_url: 32, legal_mentions: 33, legal_mentions_url: 34, legal_cookies: 35, legal_cookies_url: 36,
                          copyright: 37
                        }
                      };
                      return orders[section]?.[key] || 999;
                    };
                    
                    const sortedItems = sectionItems.sort((a: any, b: any) => 
                      getOrder(a.section, a.key) - getOrder(b.section, b.key)
                    );
                    
                     return (
                    <Card key={sectionKey} className="border border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{sectionNames[sectionKey] || sectionKey}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {sortedItems.map((item: any) => (
                            <div key={`${item.section}-${item.key}`} className="flex items-center gap-4">
                              <div className="min-w-0 flex-1">
                                 <Label className="text-sm font-medium capitalize">
                                   {getKeyTranslation(item.key)}
                                 </Label>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-1 w-full justify-start text-left">
                                       <Edit2 className="h-4 w-4 mr-2" />
                                       {item.content_type === 'number' 
                                         ? item.value 
                                         : item.value?.length > 50 
                                           ? `${item.value.substring(0, 50)}...` 
                                           : item.value || 'Modifier'}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Modifier {getKeyTranslation(item.key)}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={(e) => {
                                      e.preventDefault();
                                      updateSiteContent(new FormData(e.currentTarget));
                                    }} className="space-y-4">
                                      <input type="hidden" name="section" value={item.section} />
                                      <input type="hidden" name="key" value={item.key} />
                                      <div>
                                        <Label>{getKeyTranslation(item.key)}</Label>
                                         {item.content_type === 'text' && item.value?.length > 100 ? (
                                           <Textarea
                                             name="value"
                                             defaultValue={item.value}
                                             className="min-h-[100px]"
                                             required
                                           />
                                         ) : (
                                           <Input
                                             name="value"
                                             type={item.content_type === 'number' ? 'number' : 'text'}
                                             defaultValue={item.value}
                                             required
                                           />
                                         )}
                                      </div>
                                      <div className="flex justify-end">
                                        <Button type="submit">Modifier</Button>
                                      </div>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    );
                    })}
                  </div>

                  {/* Toutes les autres pages du site */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Autres pages du site</h3>
                    {['a-propos', 'carrieres', 'presse', 'cartes-cadeaux', 'faq', 'services', 'horaires', 'conditions', 'mentions-legales', 'politique-confidentialite', 'cookies'].map((sectionKey) => {
                      const sectionItems = siteContent.filter((item: any) => item.section === sectionKey);
                      if (sectionItems.length === 0) return null;
                      
                      // Noms affichés pour chaque section
                      const secondarySectionNames: Record<string, string> = {
                        'a-propos': 'À propos',
                        'carrieres': 'Carrières', 
                        'presse': 'Presse',
                        'cartes-cadeaux': 'Cartes cadeaux',
                        'faq': 'Questions fréquentes',
                        'services': 'Nos services', 
                        'horaires': 'Horaires',
                        'conditions': 'Conditions générales',
                        'mentions-legales': 'Mentions légales',
                        'politique-confidentialite': 'Politique de confidentialité',
                        'cookies': 'Politique des cookies'
                      };
                      
                      return (
                        <Card key={sectionKey} className="mb-4">
                          <CardHeader>
                            <CardTitle className="text-base">{secondarySectionNames[sectionKey] || sectionKey}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4">
                              {sectionItems.map((item: any) => (
                                <div key={item.id} className="space-y-2">
                                  <Label className="text-sm font-medium">{item.key}</Label>
                                  {item.content_type === 'html' ? (
                                     <Textarea
                                       defaultValue={item.value}
                                       onChange={(e) => updateSiteContentInline(item.id, e.target.value)}
                                       className="min-h-[100px] font-mono text-sm"
                                       placeholder="Contenu HTML..."
                                     />
                                   ) : (
                                     <Input
                                       defaultValue={item.value}
                                       onChange={(e) => updateSiteContentInline(item.id, e.target.value)}
                                       placeholder="Contenu..."
                                     />
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des destinations populaires */}
          <TabsContent value="popular-destinations">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des destinations populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {siteContent
                    .filter(item => item.section === 'popular_destinations')
                    .map((item) => {
                      if (item.key === 'section_title') {
                        return (
                          <Card key={item.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">Titre de la section</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Input
                                  id={`content-${item.id}`}
                                  defaultValue={item.value || ''}
                                  placeholder="Titre de la section"
                                />
                                <Button 
                                  onClick={() => {
                                    const input = document.getElementById(`content-${item.id}`) as HTMLInputElement;
                                    updateSiteContentInline(item.id, input.value);
                                  }}
                                  className="w-full"
                                >
                                  Sauvegarder le titre
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else if (item.content_type === 'destination') {
                        const destinationData = JSON.parse(item.value || '{}');
                        return (
                          <Card key={item.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{destinationData.title || 'Destination'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`dest-title-${item.id}`}>Titre</Label>
                                    <Input
                                      id={`dest-title-${item.id}`}
                                      defaultValue={destinationData.title || ''}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`dest-location-${item.id}`}>Lieu</Label>
                                    <Input
                                      id={`dest-location-${item.id}`}
                                      defaultValue={destinationData.location || ''}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`dest-price-${item.id}`}>Prix</Label>
                                    <Input
                                      id={`dest-price-${item.id}`}
                                      defaultValue={destinationData.price || ''}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`dest-rating-${item.id}`}>Note (1-5)</Label>
                                    <Input
                                      id={`dest-rating-${item.id}`}
                                      type="number"
                                      min="1"
                                      max="5"
                                      defaultValue={destinationData.rating || 5}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`dest-reviews-${item.id}`}>Nombre d'avis</Label>
                                    <Input
                                      id={`dest-reviews-${item.id}`}
                                      type="number"
                                      defaultValue={destinationData.reviews || 100}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`dest-image-${item.id}`}>URL de l'image</Label>
                                    <Input
                                      id={`dest-image-${item.id}`}
                                      defaultValue={destinationData.image_url || ''}
                                      placeholder="URL de l'image ou utilisez l'upload ci-dessous"
                                    />
                                  </div>
                                </div>
                                
                                {/* Upload d'image */}
                                <div className="mt-4">
                                  <ImageUploader
                                    currentImageUrl={destinationData.image_url}
                                    onImageUploaded={(url) => {
                                      const input = document.getElementById(`dest-image-${item.id}`) as HTMLInputElement;
                                      if (input) input.value = url;
                                    }}
                                    label="Image de la destination"
                                    folder="destinations"
                                  />
                                </div>
                                <Button 
                                  onClick={() => {
                                    const title = (document.getElementById(`dest-title-${item.id}`) as HTMLInputElement).value;
                                    const location = (document.getElementById(`dest-location-${item.id}`) as HTMLInputElement).value;
                                    const price = (document.getElementById(`dest-price-${item.id}`) as HTMLInputElement).value;
                                    const rating = parseInt((document.getElementById(`dest-rating-${item.id}`) as HTMLInputElement).value);
                                    const reviews = parseInt((document.getElementById(`dest-reviews-${item.id}`) as HTMLInputElement).value);
                                    const image_url = (document.getElementById(`dest-image-${item.id}`) as HTMLInputElement).value;
                                    
                                    const updated = {
                                      ...destinationData,
                                      title,
                                      location,
                                      price,
                                      rating,
                                      reviews,
                                      image_url
                                    };
                                    updateSiteContentInline(item.id, JSON.stringify(updated));
                                  }}
                                  className="w-full"
                                >
                                  Sauvegarder cette destination
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des témoignages clients */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des témoignages clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {siteContent
                    .filter(item => item.section === 'customer_testimonials')
                    .map((item) => {
                      if (item.key === 'section_title') {
                        return (
                          <Card key={item.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">Titre de la section</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Input
                                  id={`content-${item.id}`}
                                  defaultValue={item.value || ''}
                                  placeholder="Titre de la section"
                                />
                                <Button 
                                  onClick={() => {
                                    const input = document.getElementById(`content-${item.id}`) as HTMLInputElement;
                                    updateSiteContentInline(item.id, input.value);
                                  }}
                                  className="w-full"
                                >
                                  Sauvegarder le titre
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else if (item.content_type === 'testimonial') {
                        const testimonialData = JSON.parse(item.value || '{}');
                        return (
                          <Card key={item.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{testimonialData.name || 'Témoignage'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`test-name-${item.id}`}>Nom</Label>
                                    <Input
                                      id={`test-name-${item.id}`}
                                      defaultValue={testimonialData.name || ''}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`test-location-${item.id}`}>Lieu</Label>
                                    <Input
                                      id={`test-location-${item.id}`}
                                      defaultValue={testimonialData.location || ''}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`test-rating-${item.id}`}>Note (1-5)</Label>
                                    <Input
                                      id={`test-rating-${item.id}`}
                                      type="number"
                                      min="1"
                                      max="5"
                                      defaultValue={testimonialData.rating || 5}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`test-avatar-${item.id}`}>URL de l'avatar</Label>
                                    <Input
                                      id={`test-avatar-${item.id}`}
                                      defaultValue={testimonialData.avatar_url || ''}
                                      placeholder="URL de l'avatar ou utilisez l'upload ci-dessous"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label htmlFor={`test-comment-${item.id}`}>Commentaire</Label>
                                    <Textarea
                                      id={`test-comment-${item.id}`}
                                      defaultValue={testimonialData.comment || ''}
                                    />
                                  </div>
                                </div>
                                
                                {/* Upload d'avatar */}
                                <div className="mt-4">
                                  <ImageUploader
                                    currentImageUrl={testimonialData.avatar_url}
                                    onImageUploaded={(url) => {
                                      const input = document.getElementById(`test-avatar-${item.id}`) as HTMLInputElement;
                                      if (input) input.value = url;
                                    }}
                                    label="Avatar du client"
                                    folder="avatars"
                                  />
                                </div>
                                <Button 
                                  onClick={() => {
                                    const name = (document.getElementById(`test-name-${item.id}`) as HTMLInputElement).value;
                                    const location = (document.getElementById(`test-location-${item.id}`) as HTMLInputElement).value;
                                    const rating = parseInt((document.getElementById(`test-rating-${item.id}`) as HTMLInputElement).value);
                                    const avatar_url = (document.getElementById(`test-avatar-${item.id}`) as HTMLInputElement).value;
                                    const comment = (document.getElementById(`test-comment-${item.id}`) as HTMLTextAreaElement).value;
                                    
                                    const updated = {
                                      ...testimonialData,
                                      name,
                                      location,
                                      rating,
                                      avatar_url,
                                      comment
                                    };
                                    updateSiteContentInline(item.id, JSON.stringify(updated));
                                  }}
                                  className="w-full"
                                >
                                  Sauvegarder ce témoignage
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion de l'ordre des sections */}
          <TabsContent value="page-order">
            <Card>
              <CardHeader>
                <CardTitle>Gestion de l'ordre des sections de la page d'accueil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Gérez l'ordre d'affichage et la visibilité des sections sur la page d'accueil.
                  </p>
                  {pageOrder.map((section, index) => {
                    const sectionData = JSON.parse(section.value || '{}');
                    return (
                      <Card key={section.id} className={`p-4 ${!sectionData.enabled ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-center space-y-1">
                              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                #{sectionData.order}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{sectionData.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Composant: {sectionData.component}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* Boutons de déplacement */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                              title="Déplacer vers le haut"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === pageOrder.length - 1}
                              title="Déplacer vers le bas"
                            >
                              ↓
                            </Button>
                            
                            {/* Bouton d'activation/désactivation */}
                            <Button
                              variant={sectionData.enabled ? "destructive" : "default"}
                              size="sm"
                              onClick={() => toggleSection(section.id)}
                            >
                              {sectionData.enabled ? 'Désactiver' : 'Activer'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;