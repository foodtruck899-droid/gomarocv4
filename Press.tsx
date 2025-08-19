import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, ExternalLink, Image, FileText, Video } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Press = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {getContent('presse', 'title', 'Espace Presse')}
          </h1>
          <div 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getContent('presse', 'hero_description', 
                'Retrouvez toutes les actualités, communiqués de presse et ressources médias de Go Maroc. Pour toute demande d\'information complémentaire, contactez notre service presse.'
              )
            }}
          />
        </div>

        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>{getContent('presse', 'contact_title', 'Contact Presse')}</CardTitle>
              <CardDescription>{getContent('presse', 'contact_subtitle', 'Pour toute demande d\'interview ou d\'information')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                dangerouslySetInnerHTML={{
                  __html: getContent('presse', 'contact_info', 
                    `<div>
                      <h4 class="font-semibold mb-2">Sarah Benali</h4>
                      <p class="text-muted-foreground mb-1">Responsable Communication</p>
                      <p class="text-sm text-muted-foreground mb-3">
                        📧 presse@go-maroc.com<br/>
                        📱 +33 1 42 85 96 74<br/>
                        🕒 Disponible du lundi au vendredi, 9h-18h
                      </p>
                    </div>
                    <div>
                      <h4 class="font-semibold mb-2">Informations pratiques</h4>
                      <p class="text-sm text-muted-foreground">
                        Délai de réponse : 24h maximum<br/>
                        Interviews : Français, Arabe, Anglais<br/>
                        Visites de nos installations sur RDV
                      </p>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            {getContent('presse', 'communiques_title', 'Derniers Communiqués')}
          </h2>
          <div 
            className="space-y-6"
            dangerouslySetInnerHTML={{
              __html: getContent('presse', 'communiques_liste', 
                `<div class="space-y-6">
                  <div class="border rounded-lg p-6">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm text-muted-foreground">15 janvier 2024</span>
                      <span class="px-2 py-1 bg-muted rounded text-xs">Communiqué de presse</span>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Go Maroc annonce l'ouverture de nouvelles liaisons vers Agadir et Marrakech</h3>
                    <p class="text-muted-foreground">L'entreprise étend son réseau avec 3 nouveaux départs quotidiens vers les destinations touristiques phares du Maroc.</p>
                  </div>
                  <div class="border rounded-lg p-6">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm text-muted-foreground">8 décembre 2023</span>
                      <span class="px-2 py-1 bg-muted rounded text-xs">Actualité entreprise</span>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Go Maroc renouvelle sa flotte avec 15 nouveaux autobus écologiques Euro 6</h3>
                    <p class="text-muted-foreground">Un investissement de 3 millions d'euros pour réduire l'empreinte carbone et améliorer le confort des passagers.</p>
                  </div>
                </div>`
              )
            }}
          />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            {getContent('presse', 'media_kit_title', 'Kit Média')}
          </h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            dangerouslySetInnerHTML={{
              __html: getContent('presse', 'media_kit_liste', 
                `<div class="border rounded-lg p-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span class="text-primary">📷</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold">Logo Go Maroc - Haute définition</h4>
                      <p class="text-sm text-muted-foreground">PNG, JPG, SVG • 2.5 MB</p>
                    </div>
                    <button class="px-3 py-2 border rounded text-sm">Télécharger</button>
                  </div>
                </div>
                <div class="border rounded-lg p-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span class="text-primary">📄</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold">Dossier de presse 2024</h4>
                      <p class="text-sm text-muted-foreground">PDF • 8.2 MB</p>
                    </div>
                    <button class="px-3 py-2 border rounded text-sm">Télécharger</button>
                  </div>
                </div>`
              )
            }}
          />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {getContent('presse', 'chiffres_title', 'Go Maroc en Chiffres')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('presse', 'chiffre1_nombre', '15')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {getContent('presse', 'chiffre1_label', "Années d'expérience")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('presse', 'chiffre2_nombre', '100K+')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {getContent('presse', 'chiffre2_label', 'Passagers transportés par an')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('presse', 'chiffre3_nombre', '52')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {getContent('presse', 'chiffre3_label', 'Autobus dans la flotte')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('presse', 'chiffre4_nombre', '35')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {getContent('presse', 'chiffre4_label', 'Destinations desservies')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>
                {getContent('presse', 'recompenses_title', 'Récompenses et Certifications')}
              </CardTitle>
              <CardDescription>
                {getContent('presse', 'recompenses_subtitle', 'Les reconnaissances obtenues par Go Maroc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                dangerouslySetInnerHTML={{
                  __html: getContent('presse', 'recompenses_liste', 
                    `<div>
                      <h4 class="font-semibold mb-3">Prix et distinctions</h4>
                      <ul class="space-y-2 text-sm text-muted-foreground">
                        <li>🏆 Prix de l'Excellence Transport 2023 - FNTR</li>
                        <li>🥇 Meilleur Service Client Transport - 2022</li>
                        <li>🌍 Label Écotransport pour notre flotte verte</li>
                        <li>⭐ Note moyenne 4.8/5 sur 10 000+ avis clients</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-semibold mb-3">Certifications</h4>
                      <ul class="space-y-2 text-sm text-muted-foreground">
                        <li>✅ Certification ISO 9001:2015 (Qualité)</li>
                        <li>✅ Agrément Préfectoral Transport Voyageurs</li>
                        <li>✅ Certification IATA pour les transferts aéroports</li>
                        <li>✅ Licence Transport International UE-Maroc</li>
                      </ul>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Press;