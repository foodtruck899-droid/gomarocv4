import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
      setupRealtimeSubscriptions();
    }

    return () => {
      // Cleanup subscriptions when component unmounts
      supabase.removeAllChannels();
    };
  }, [user]);

  const setupRealtimeSubscriptions = () => {
    // Listen to changes in bookings table
    const bookingsChannel = supabase
      .channel('bookings_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Booking changed:', payload);
          loadUserData(); // Reload data when bookings change
        }
      )
      .subscribe();

    // Listen to changes in profiles table
    const profilesChannel = supabase
      .channel('profiles_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Profile changed:', payload);
          loadUserData(); // Reload data when profile changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(profilesChannel);
    };
  };

  const loadUserData = async () => {
    if (!user?.id) {
      console.log('❌ No user ID available');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Loading data for user:', user.id);
      console.log('👤 User object:', user);

      // Test si l'utilisateur existe dans profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📋 Profile query result:', { profileData, profileError });

      // Test des bookings - chercher toutes les réservations pour l'admin
      let bookingsQuery = supabase
        .from('bookings')
        .select(`
          *,
          trips:trip_id (
            *,
            routes:route_id (
              *,
              origin_destinations:destinations!routes_origin_id_fkey(name),
              destination_destinations:destinations!routes_destination_id_fkey(name)
            )
          )
        `);

      // Si l'utilisateur est admin, montrer toutes les réservations
      // Sinon, chercher par user_id ou par email
      if (profileData?.role === 'admin') {
        bookingsQuery = bookingsQuery.order('created_at', { ascending: false }).limit(20);
      } else {
        bookingsQuery = bookingsQuery
          .or(`user_id.eq.${user.id},passenger_email.eq.${user.email}`)
          .order('created_at', { ascending: false });
      }

      const { data: bookingsData, error: bookingsError } = await bookingsQuery;

      console.log('🎫 Bookings query result:', { bookingsData, bookingsError });

      if (profileData) {
        // Ajouter l'email depuis l'auth user
        const profileWithEmail = {
          ...profileData,
          email: user.email
        };
        console.log('✅ Setting profile:', profileWithEmail);
        setProfile(profileWithEmail);
      } else {
        console.log('⚠️ No profile found, creating default profile object');
        setProfile({
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          phone: '',
          role: 'user'
        });
      }

      if (bookingsData) {
        console.log('✅ Setting bookings:', bookingsData);
        setBookings(bookingsData);
      } else {
        console.log('⚠️ No bookings found');
        setBookings([]);
      }

    } catch (error) {
      console.error('💥 Error loading user data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: formData.get('fullName') as string,
          phone: formData.get('phone') as string,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès.",
      });
      setEditing(false);
      loadUserData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-16">
          <p>Vous devez être connecté pour accéder à cette page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Mon Profil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Informations du profil */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations personnelles</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Annuler' : 'Modifier'}
              </Button>
            </CardHeader>
            <CardContent>
              {editing ? (
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      defaultValue={profile?.full_name || ''}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={profile?.phone || ''}
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                    Sauvegarder
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.full_name || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="pt-2">
                    <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                      {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Mes voyages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{bookings.length}</div>
                  <div className="text-sm text-muted-foreground">Réservations totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {bookings.filter(b => b.booking_status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Voyages confirmés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toFixed(2)}€
                  </div>
                  <div className="text-sm text-muted-foreground">Total dépensé</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historique des réservations */}
        <Card>
          <CardHeader>
            <CardTitle>Mes réservations</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Itinéraire</TableHead>
                    <TableHead>Date de départ</TableHead>
                    <TableHead>Passagers</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.trips?.routes?.origin_destinations?.name} → {booking.trips?.routes?.destination_destinations?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.trips?.departure_time ? new Date(booking.trips.departure_time).toLocaleDateString('fr-FR') : 'N/A'}</TableCell>
                      <TableCell>{booking.passengers}</TableCell>
                      <TableCell>{booking.total_price}€</TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.booking_status === 'confirmed' ? 'default' : 
                          booking.booking_status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {booking.booking_status === 'confirmed' ? 'Confirmé' : 
                           booking.booking_status === 'pending' ? 'En attente' : 'Annulé'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune réservation trouvée.</p>
                <Button className="mt-4 bg-gradient-to-r from-primary to-accent">
                  Réserver un voyage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;