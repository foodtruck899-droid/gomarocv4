import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InteractiveMap from "@/components/InteractiveMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Wifi, Coffee, Car, Phone, Info, Navigation } from "lucide-react";

const BusStations = () => {
  const frenchStations = [
    {
      city: "Paris",
      name: "Gare Routière de Bercy",
      address: "211 Quai de Bercy, 75012 Paris",
      phone: "+33 1 43 45 15 15",
      services: ["WiFi", "Cafétéria", "Parking", "Consigne", "Toilettes", "PMR"],
      openHours: "5h00 - 23h00",
      metro: "Gare de Lyon (Métro 1, 14, RER A, D)",
      description: "Principal hub parisien avec connexions directes vers toutes nos destinations marocaines."
    },
    {
      city: "Lyon",
      name: "Gare Routière de Perrache",
      address: "Place Carnot, 69002 Lyon",
      phone: "+33 4 72 56 95 30",
      services: ["WiFi", "Restauration", "Parking payant", "Toilettes"],
      openHours: "6h00 - 22h00",
      metro: "Perrache (Métro A, Tram T1, T2)",
      description: "Gare moderne au cœur de Lyon avec liaisons vers Rabat et Casablanca."
    },
    {
      city: "Marseille",
      name: "Gare Routière Saint-Charles",
      address: "3 Place des Marseillaises, 13001 Marseille",
      phone: "+33 4 91 08 16 40",
      services: ["WiFi", "Snacking", "Parking", "Toilettes", "PMR"],
      openHours: "5h30 - 23h30",
      metro: "Saint-Charles (Métro 1, 2)",
      description: "Départs fréquents vers Agadir et les destinations du Sud marocain."
    },
    {
      city: "Toulouse",
      name: "Gare Routière Pierre Sémard",
      address: "Boulevard Pierre Sémard, 31000 Toulouse",
      phone: "+33 5 61 61 67 67",
      services: ["WiFi", "Cafétéria", "Parking", "Toilettes"],
      openHours: "6h00 - 22h00",
      metro: "Matabiau (Métro A)",
      description: "Point de départ vers Marrakech et Casablanca depuis le Sud-Ouest."
    }
  ];

  const moroccanStations = [
    {
      city: "Casablanca",
      name: "Gare Routière Ouled Ziane",
      address: "Boulevard Mohammed V, Casablanca",
      phone: "+212 5 22 31 11 22",
      services: ["WiFi", "Restauration", "Parking", "Change", "Toilettes", "PMR"],
      openHours: "24h/24",
      description: "Principale gare du Maroc avec connexions vers toute la France."
    },
    {
      city: "Rabat",
      name: "Gare Routière Kamra",
      address: "Avenue des Forces Armées Royales, Rabat",
      phone: "+212 5 37 70 14 69",
      services: ["WiFi", "Snacking", "Parking", "Toilettes"],
      openHours: "5h00 - 24h00",
      description: "Gare moderne de la capitale avec services premium."
    },
    {
      city: "Agadir",
      name: "Gare Routière Inezgane",
      address: "Avenue Hassan II, Inezgane-Agadir",
      phone: "+212 5 28 33 12 44",
      services: ["WiFi", "Restauration", "Parking gratuit", "Toilettes"],
      openHours: "6h00 - 23h00",
      description: "Porte d'entrée du Sud marocain, proche de l'aéroport."
    },
    {
      city: "Marrakech",
      name: "Gare Routière Bab Doukkala",
      address: "Avenue Hassan II, Marrakech",
      phone: "+212 5 24 43 39 33",
      services: ["WiFi", "Cafétéria", "Parking", "Change", "Toilettes"],
      openHours: "5h30 - 23h30",
      description: "Au cœur de la ville rouge, accès direct aux principaux sites."
    }
  ];

  const serviceIcons = {
    "WiFi": Wifi,
    "Cafétéria": Coffee,
    "Restauration": Coffee,
    "Snacking": Coffee,
    "Parking": Car,
    "Parking payant": Car,
    "Parking gratuit": Car,
    "Consigne": Info,
    "Toilettes": Info,
    "PMR": Info,
    "Change": Info
  };

  const StationCard = ({ station, country }: { station: any, country: string }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {station.city}
            </CardTitle>
            <CardDescription className="mt-1 font-medium">{station.name}</CardDescription>
          </div>
          <Badge variant={country === 'france' ? 'default' : 'secondary'}>
            {country === 'france' ? '🇫🇷 France' : '🇲🇦 Maroc'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{station.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{station.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{station.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Ouvert {station.openHours}</span>
          </div>
          
          {station.metro && (
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <span>{station.metro}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Services disponibles :</h4>
          <div className="flex flex-wrap gap-2">
            {station.services.map((service: string, idx: number) => {
              const Icon = serviceIcons[service as keyof typeof serviceIcons] || Info;
              return (
                <Badge key={idx} variant="outline" className="flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  {service}
                </Badge>
              );
            })}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <MapPin className="h-4 w-4 mr-2" />
          Voir sur la carte
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative">
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Nos Gares Routières
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez toutes nos gares routières en France et au Maroc. Des espaces modernes et confortables 
            pour commencer votre voyage dans les meilleures conditions.
          </p>
        </div>

        {/* Gares en France */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">🇫🇷 Nos Gares en France</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frenchStations.map((station, index) => (
              <StationCard key={index} station={station} country="france" />
            ))}
          </div>
        </section>

        {/* Gares au Maroc */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">🇲🇦 Nos Gares au Maroc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moroccanStations.map((station, index) => (
              <StationCard key={index} station={station} country="morocco" />
            ))}
          </div>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Arrivée en gare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Présentez-vous 45 minutes avant le départ avec votre billet et pièce d'identité. 
                  L'embarquement commence 30 minutes avant.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Stationnement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Parkings disponibles dans la plupart de nos gares. Tarifs préférentiels 
                  pour nos clients. Réservation recommandée en ligne.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  WiFi gratuit, espaces de restauration et consignes disponibles. 
                  Assistance PMR sur demande 48h à l'avance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Carte interactive */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Carte Interactive de nos Gares</CardTitle>
              <CardDescription className="text-center">
                Localisez facilement toutes nos gares routières
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveMap />
            </CardContent>
          </Card>
        </section>

        {/* Contact gares */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
              <CardDescription>Nos équipes sont là pour vous accompagner</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🇫🇷 Assistance France</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href="tel:+33142859674" className="hover:text-primary transition-colors">
                        +33 1 42 85 96 74
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
                      </svg>
                      <a 
                        href="https://wa.me/33142859674" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-green-600 transition-colors"
                      >
                        WhatsApp France
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Lundi au dimanche : 7h00 - 22h00</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🇲🇦 Assistance Maroc</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href="tel:+212522311122" className="hover:text-primary transition-colors">
                        +212 5 22 31 11 22
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
                      </svg>
                      <a 
                        href="https://wa.me/212522311122" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-green-600 transition-colors"
                      >
                        WhatsApp Maroc
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Tous les jours : 6h00 - 24h00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
      
      <WhatsAppButton />
    </div>
    </div>
  );
};

export default BusStations;