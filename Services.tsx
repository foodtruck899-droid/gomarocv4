import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteContent } from "@/hooks/useSiteContent";

const Services = () => {
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
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getContent('services', 'title', 'Nos Services')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('services', 'subtitle', 'Découvrez tous les services GO MAROC pour votre voyage')}
          </p>
        </div>

        <div className="grid gap-8">
          {/* Transport de bagages */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧳</span>
                <CardTitle>{getContent('services', 'bagages_title', 'Transport de bagages')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="grid md:grid-cols-2 gap-6"
                dangerouslySetInnerHTML={{
                  __html: getContent('services', 'bagages_contenu', 
                    `<div class="space-y-4">
                      <h3 class="font-semibold">Bagages inclus</h3>
                      <ul class="space-y-2 text-sm">
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>1 bagage à main (8kg max, 40x30x20cm)</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>1 bagage en soute (23kg max)</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Étiquetage et suivi inclus</span>
                        </li>
                      </ul>
                    </div>
                    <div class="space-y-4">
                      <h3 class="font-semibold">Bagages supplémentaires</h3>
                      <div class="space-y-3">
                        <div class="p-3 border rounded">
                          <div class="flex justify-between items-center">
                            <span class="text-sm">Bagage supplémentaire (23kg)</span>
                            <span class="font-bold text-primary">45€</span>
                          </div>
                        </div>
                        <div class="p-3 border rounded">
                          <div class="flex justify-between items-center">
                            <span class="text-sm">Surpoids (par kg supplémentaire)</span>
                            <span class="font-bold text-primary">8€</span>
                          </div>
                        </div>
                      </div>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Services Premium */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⭐</span>
                  <CardTitle>{getContent('services', 'premium_title', 'Services Premium')}</CardTitle>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold">
                  {getContent('services', 'premium_badge', 'Nouveau')}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="grid md:grid-cols-2 gap-6"
                dangerouslySetInnerHTML={{
                  __html: getContent('services', 'premium_contenu', 
                    `<div class="space-y-4">
                      <h3 class="font-semibold">Premium Economy</h3>
                      <ul class="space-y-2 text-sm">
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Sièges plus larges avec repose-pieds</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Kit confort (oreiller, couverture)</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Repas gastronomique inclus</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Wi-Fi haut débit gratuit</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Priorité à l'embarquement</span>
                        </li>
                      </ul>
                      <div class="pt-2">
                        <span class="text-lg font-bold text-primary">+89€</span>
                        <span class="text-sm text-muted-foreground ml-2">par trajet</span>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <h3 class="font-semibold">Business Class</h3>
                      <ul class="space-y-2 text-sm">
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Sièges inclinables 180°</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Service concierge personnel</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Salon d'attente VIP</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Bagage supplémentaire inclus</span>
                        </li>
                        <li class="flex items-center space-x-2">
                          <span>✅</span>
                          <span>Transfert aéroport gratuit</span>
                        </li>
                      </ul>
                      <div class="pt-2">
                        <span class="text-lg font-bold text-primary">+189€</span>
                        <span class="text-sm text-muted-foreground ml-2">par trajet</span>
                      </div>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Services aux familles */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                <CardTitle>{getContent('services', 'famille_title', 'Services Famille')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{
                  __html: getContent('services', 'famille_contenu', 
                    `<div class="grid md:grid-cols-3 gap-4">
                      <div class="text-center p-4 border rounded">
                        <div class="text-2xl mb-2">👶</div>
                        <h4 class="font-semibold mb-2">Bébés (0-2 ans)</h4>
                        <p class="text-sm text-muted-foreground">Voyage gratuit sur les genoux d'un adulte</p>
                      </div>
                      <div class="text-center p-4 border rounded">
                        <div class="text-2xl mb-2">🧒</div>
                        <h4 class="font-semibold mb-2">Enfants (2-12 ans)</h4>
                        <p class="text-sm text-muted-foreground">Réduction de 25% sur le tarif adulte</p>
                      </div>
                      <div class="text-center p-4 border rounded">
                        <div class="text-2xl mb-2">👥</div>
                        <h4 class="font-semibold mb-2">Familles nombreuses</h4>
                        <p class="text-sm text-muted-foreground">Réduction supplémentaire à partir de 4 enfants</p>
                      </div>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Support client */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎧</span>
                <CardTitle>{getContent('services', 'support_title', 'Support Client 24/7')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{
                  __html: getContent('services', 'support_contenu', 
                    `<p class="text-muted-foreground mb-6">Notre équipe de support multilingue est disponible 24h/24 et 7j/7 pour vous accompagner avant, pendant et après votre voyage.</p>
                    <div class="grid md:grid-cols-2 gap-6">
                      <div class="space-y-4">
                        <h3 class="font-semibold">Assistance voyage</h3>
                        <ul class="space-y-2 text-sm">
                          <li class="flex items-center space-x-2">
                            <span>📞</span>
                            <span>Hotline d'urgence 24h/24</span>
                          </li>
                          <li class="flex items-center space-x-2">
                            <span>💬</span>
                            <span>Chat en direct sur notre site</span>
                          </li>
                          <li class="flex items-center space-x-2">
                            <span>📱</span>
                            <span>Application mobile avec suivi temps réel</span>
                          </li>
                        </ul>
                      </div>
                      <div class="space-y-4">
                        <h3 class="font-semibold">Services personnalisés</h3>
                        <ul class="space-y-2 text-sm">
                          <li class="flex items-center space-x-2">
                            <span>🎯</span>
                            <span>Conseils personnalisés pour votre voyage</span>
                          </li>
                          <li class="flex items-center space-x-2">
                            <span>🔔</span>
                            <span>Notifications SMS/Email automatiques</span>
                          </li>
                          <li class="flex items-center space-x-2">
                            <span>🏆</span>
                            <span>Programme de fidélité avec avantages</span>
                          </li>
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

export default Services;