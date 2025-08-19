import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Euro } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Schedules = () => {
  const { getContent, loading } = useSiteContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{getContent('general', 'loading', 'Chargement...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getContent('horaires', 'title', 'Horaires & Tarifs')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('horaires', 'subtitle', 'Consultez les horaires de départ et les tarifs pour toutes nos destinations')}
          </p>
        </div>

        <div className="space-y-6">
          <div 
            dangerouslySetInnerHTML={{
              __html: getContent('horaires', 'routes_horaires', 
                `<div class="space-y-6">
                  <div class="border rounded-lg">
                    <div class="p-4 border-b">
                      <h3 class="text-lg font-semibold flex items-center space-x-2">
                        <span>🚌</span>
                        <span>Casablanca → Paris</span>
                      </h3>
                    </div>
                    <div class="p-4">
                      <div class="grid gap-4">
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">08:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">350€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">14:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">380€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">20:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">340€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Complet</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border rounded-lg">
                    <div class="p-4 border-b">
                      <h3 class="text-lg font-semibold flex items-center space-x-2">
                        <span>🚌</span>
                        <span>Rabat → Lyon</span>
                      </h3>
                    </div>
                    <div class="p-4">
                      <div class="grid gap-4">
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">09:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">320€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">15:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">340€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border rounded-lg">
                    <div class="p-4 border-b">
                      <h3 class="text-lg font-semibold flex items-center space-x-2">
                        <span>🚌</span>
                        <span>Marrakech → Marseille</span>
                      </h3>
                    </div>
                    <div class="p-4">
                      <div class="grid gap-4">
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">07:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">370€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">13:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">390€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <span>🕰️</span>
                              <span class="font-semibold">19:00</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <span>💶</span>
                              <span class="font-semibold text-primary">360€</span>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`
              )
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                {getContent('horaires', 'info_title', 'Informations importantes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{
                  __html: getContent('horaires', 'info_contenu', 
                    `<div class="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 class="font-semibold mb-3">Réservations</h4>
                        <ul class="space-y-2 text-sm text-muted-foreground">
                          <li>• Réservation obligatoire au moins 24h avant le départ</li>
                          <li>• Les prix peuvent varier selon la saison et la disponibilité</li>
                          <li>• Réductions étudiants et seniors disponibles</li>
                        </ul>
                      </div>
                      <div>
                        <h4 class="font-semibold mb-3">Embarquement</h4>
                        <ul class="space-y-2 text-sm text-muted-foreground">
                          <li>• Présence obligatoire 45 minutes avant le départ</li>
                          <li>• Documents d'identité valides requis</li>
                          <li>• Retards non remboursables</li>
                        </ul>
                      </div>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Schedules;