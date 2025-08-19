import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock } from "lucide-react";

const Destinations = () => {
  const destinations = [
    {
      city: "Paris",
      country: "France",
      image: "🇫🇷",
      frequency: "Quotidien",
      duration: "2j 10h",
      startingPrice: "340€",
      rating: 4.8,
      description: "La capitale française vous attend avec ses monuments emblématiques"
    },
    {
      city: "Lyon",
      country: "France", 
      image: "🇫🇷",
      frequency: "3x/semaine",
      duration: "2j 8h",
      startingPrice: "320€",
      rating: 4.7,
      description: "Ville gastronomique au cœur de la France"
    },
    {
      city: "Marseille",
      country: "France",
      image: "🇫🇷", 
      frequency: "Quotidien",
      duration: "2j 6h",
      startingPrice: "360€",
      rating: 4.6,
      description: "Porte d'entrée sur la Méditerranée"
    },
    {
      city: "Toulouse",
      country: "France",
      image: "🇫🇷",
      frequency: "2x/semaine", 
      duration: "2j 9h",
      startingPrice: "350€",
      rating: 4.5,
      description: "La ville rose et son patrimoine unique"
    },
    {
      city: "Bordeaux",
      country: "France",
      image: "🇫🇷",
      frequency: "2x/semaine",
      duration: "2j 11h", 
      startingPrice: "370€",
      rating: 4.7,
      description: "Capitale mondiale du vin"
    },
    {
      city: "Nantes",
      country: "France",
      image: "🇫🇷",
      frequency: "1x/semaine",
      duration: "2j 12h",
      startingPrice: "380€", 
      rating: 4.4,
      description: "Ville d'art et d'histoire"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Destinations populaires</h1>
          <p className="text-muted-foreground">Découvrez toutes nos destinations depuis le Maroc</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">{destination.image}</span>
                      <div>
                        <div className="text-lg">{destination.city}</div>
                        <div className="text-sm text-muted-foreground">{destination.country}</div>
                      </div>
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{destination.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Durée:</span>
                    </span>
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Fréquence:</span>
                    <Badge variant="secondary">{destination.frequency}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">À partir de</div>
                    <div className="text-xl font-bold text-primary">{destination.startingPrice}</div>
                  </div>
                  <Button>Voir les horaires</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Destinations;