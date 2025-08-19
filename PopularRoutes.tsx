import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Euro, Star, TrendingUp, Users } from "lucide-react";

const PopularRoutes = () => {
  const popularRoutes = [
    {
      from: "Paris",
      to: "Casablanca",
      duration: "48h",
      frequency: "Tous les jours",
      priceFrom: 89,
      rating: 4.8,
      passengers: "15K/an",
      trend: "+12%",
      description: "Notre liaison phare connectant la capitale française au poumon économique du Maroc."
    },
    {
      from: "Lyon",
      to: "Rabat", 
      duration: "46h",
      frequency: "6j/7",
      priceFrom: 85,
      rating: 4.7,
      passengers: "8K/an",
      trend: "+8%",
      description: "Rejoignez la capitale administrative du Maroc depuis la capitale des Gaules."
    },
    {
      from: "Marseille",
      to: "Agadir",
      duration: "44h",
      frequency: "5j/7",
      priceFrom: 95,
      rating: 4.9,
      passengers: "6K/an",
      trend: "+15%",
      description: "Échappez-vous vers la perle du Sud marocain et ses plages atlantiques."
    },
    {
      from: "Toulouse",
      to: "Marrakech",
      duration: "50h",
      frequency: "4j/7", 
      priceFrom: 99,
      rating: 4.6,
      passengers: "5K/an",
      trend: "+20%",
      description: "Découvrez la ville rouge et ses merveilles depuis la ville rose."
    },
    {
      from: "Bordeaux",
      to: "Fès",
      duration: "52h",
      frequency: "3j/7",
      priceFrom: 105,
      rating: 4.5,
      passengers: "3K/an",
      trend: "+10%",
      description: "Plongez dans l'histoire millénaire de Fès depuis la capitale mondiale du vin."
    },
    {
      from: "Strasbourg",
      to: "Tanger",
      duration: "55h",
      frequency: "2j/7",
      priceFrom: 115,
      rating: 4.4,
      passengers: "2K/an",
      trend: "+25%",
      description: "Rejoignez la porte de l'Afrique depuis la capitale européenne."
    }
  ];

  const routeStats = [
    { label: "Routes actives", value: "28", trend: "+3 cette année" },
    { label: "Fréquence moyenne", value: "5j/7", trend: "Service quotidien sur 12 routes" },
    { label: "Satisfaction", value: "4.7/5", trend: "Basé sur 25K avis" },
    { label: "Ponctualité", value: "94%", trend: "+2% vs 2023" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Itinéraires Populaires
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez nos liaisons les plus demandées entre la France et le Maroc. 
            Des connexions directes et fréquentes pour tous vos besoins de voyage.
          </p>
        </div>

        {/* Statistiques */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {routeStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm font-medium mb-2">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.trend}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Routes populaires */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nos Routes les Plus Demandées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularRoutes.map((route, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <MapPin className="h-5 w-5 text-primary" />
                        {route.from} → {route.to}
                      </CardTitle>
                      <CardDescription className="mt-2">{route.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">{route.trend}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Fréquence:</span>
                      <span>{route.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span>À partir de {route.priceFrom}€</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{route.passengers}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{route.rating}/5</span>
                      <Badge variant="secondary" className="ml-2">Populaire</Badge>
                    </div>
                    <Button size="sm">
                      Voir les horaires
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pourquoi ces routes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi ces Routes sont Populaires ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Connexions stratégiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nos routes relient les principales métropoles françaises aux centres économiques 
                  et touristiques majeurs du Maroc, facilitant les voyages d'affaires et de loisirs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Fréquences adaptées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  La fréquence de nos liaisons est étudiée selon la demande : départs quotidiens 
                  sur Paris-Casablanca, services réguliers sur les autres axes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Satisfaction client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ces itinéraires bénéficient des meilleures notes de satisfaction grâce à 
                  notre expérience et nos équipes dédiées sur chaque liaison.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nouvelles routes */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Nouvelles Routes 2024</CardTitle>
              <CardDescription>Découvrez nos dernières liaisons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Nouveau</Badge>
                    Nice → Tétouan
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Liaison directe 3 fois par semaine entre la Côte d'Azur et la perle du Nord marocain.
                  </p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">À partir de </span>
                    <span className="font-semibold text-primary">120€</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Nouveau</Badge>
                    Montpellier → Oujda
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Nouvelle connexion 2 fois par semaine vers l'Est du Maroc via l'Espagne.
                  </p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">À partir de </span>
                    <span className="font-semibold text-primary">110€</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button>
                  Voir toutes les nouvelles routes
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to action */}
        <section>
          <Card className="text-center">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-4">Prêt à réserver votre voyage ?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Consultez nos horaires détaillés, comparez les prix et réservez votre billet 
                en quelques clics pour l'une de nos destinations populaires.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">
                  Rechercher un voyage
                </Button>
                <Button variant="outline" size="lg">
                  Voir tous les horaires
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PopularRoutes;