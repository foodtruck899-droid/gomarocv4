import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Euro, Users, Briefcase, GraduationCap } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Careers = () => {
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
            {getContent('carrieres', 'title', 'Rejoignez l\'équipe Go Maroc')}
          </h1>
          <div 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getContent('carrieres', 'hero_description', 
                "Participez à l'aventure d'une entreprise en pleine croissance qui connecte deux pays et rassemble les familles. Découvrez nos opportunités de carrière dans un environnement dynamique et multiculturel."
              )
            }}
          />
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {getContent('carrieres', 'pourquoi_title', 'Pourquoi nous rejoindre ?')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {getContent('carrieres', 'avantage1_title', 'Équipe multiculturelle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getContent('carrieres', 'avantage1_description', 
                      'Travaillez dans un environnement riche en diversité culturelle avec des collègues français, marocains et de nombreuses autres nationalités.'
                    )
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {getContent('carrieres', 'avantage2_title', 'Formation continue')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getContent('carrieres', 'avantage2_description', 
                      'Bénéficiez de formations régulières pour développer vos compétences et évoluer dans votre carrière au sein de notre groupe.'
                    )
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {getContent('carrieres', 'avantage3_title', 'Avantages sociaux')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getContent('carrieres', 'avantage3_description', 
                      'Profitez d\'avantages compétitifs : mutuelle, primes, congés payés, tickets restaurant et réductions sur nos voyages.'
                    )
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {getContent('carrieres', 'offres_title', 'Nos Offres d\'Emploi')}
          </h2>
          <div 
            className="space-y-6"
            dangerouslySetInnerHTML={{
              __html: getContent('carrieres', 'offres_liste', 
                `<div class="space-y-6">
                  <div class="border rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-2">Chauffeur International</h3>
                    <p class="text-muted-foreground mb-4">Paris - Casablanca • CDI • 2800€ - 3200€</p>
                    <p class="mb-4">Rejoignez notre équipe de chauffeurs professionnels pour assurer la liaison France-Maroc.</p>
                    <p class="text-sm"><strong>Profil :</strong> Permis D + FIMO, 3 ans d'expérience minimum, Passeport valide, Français et Arabe</p>
                  </div>
                  <div class="border rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-2">Agent de Réservation</h3>
                    <p class="text-muted-foreground mb-4">Paris, Lyon, Marseille • CDI • 2200€ - 2600€</p>
                    <p class="mb-4">Accompagnez nos clients dans leurs réservations et fournissez un service client d'excellence.</p>
                    <p class="text-sm"><strong>Profil :</strong> Bac+2 minimum, Expérience client, Maîtrise français/arabe, Outils informatiques</p>
                  </div>
                </div>`
              )
            }}
          />
        </section>

        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {getContent('carrieres', 'processus_title', 'Notre Processus de Recrutement')}
              </CardTitle>
              <CardDescription>
                {getContent('carrieres', 'processus_subtitle', 'Un processus simple et transparent')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
                dangerouslySetInnerHTML={{
                  __html: getContent('carrieres', 'processus_etapes', 
                    `<div class="text-center">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span class="text-primary font-bold">1</span>
                      </div>
                      <h4 class="font-semibold mb-2">Candidature</h4>
                      <p class="text-sm text-muted-foreground">Envoyez votre CV et lettre de motivation</p>
                    </div>
                    <div class="text-center">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span class="text-primary font-bold">2</span>
                      </div>
                      <h4 class="font-semibold mb-2">Entretien RH</h4>
                      <p class="text-sm text-muted-foreground">Échange avec notre équipe des ressources humaines</p>
                    </div>
                    <div class="text-center">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span class="text-primary font-bold">3</span>
                      </div>
                      <h4 class="font-semibold mb-2">Entretien technique</h4>
                      <p class="text-sm text-muted-foreground">Validation des compétences métier</p>
                    </div>
                    <div class="text-center">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span class="text-primary font-bold">4</span>
                      </div>
                      <h4 class="font-semibold mb-2">Intégration</h4>
                      <p class="text-sm text-muted-foreground">Accueil et formation dans votre nouveau poste</p>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>
                {getContent('carrieres', 'candidature_title', 'Candidature Spontanée')}
              </CardTitle>
              <CardDescription>
                {getContent('carrieres', 'candidature_subtitle', 'Vous ne trouvez pas l\'offre qui vous correspond ?')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="text-muted-foreground mb-6"
                dangerouslySetInnerHTML={{
                  __html: getContent('carrieres', 'candidature_description', 
                    'Envoyez-nous votre candidature spontanée à <strong>recrutement@go-maroc.com</strong> en précisant le poste qui vous intéresse. Nous conservons tous les CV et vous recontacterons dès qu\'une opportunité correspondant à votre profil se présente.'
                  )
                }}
              />
              <Button size="lg">
                {getContent('carrieres', 'candidature_button', 'Envoyer ma candidature')}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;