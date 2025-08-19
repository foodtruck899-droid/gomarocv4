import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Users, Shield, Award, Heart, Globe } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const About = () => {
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
            {getContent('a-propos', 'title', 'À propos de Go Maroc')}
          </h1>
          <div 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getContent('a-propos', 'hero_description', 
                'Depuis plus de 15 ans, Go Maroc connecte le Maroc et la France en offrant des services de transport fiables, confortables et abordables. Notre mission est de rapprocher les familles et faciliter les voyages.'
              )
            }}
          />
        </div>

        {/* Notre Histoire */}
        <section className="mb-16">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Bus className="h-6 w-6" />
                {getContent('a-propos', 'histoire_title', 'Notre Histoire')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="text-muted-foreground space-y-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('a-propos', 'notre_histoire', 
                    `<p>Fondée en 2008, Go Maroc est née de la vision de créer un pont fiable entre le Maroc et la France. Ce qui a commencé comme une petite entreprise familiale s'est transformé en l'un des leaders du transport international entre ces deux pays.</p>
                    <p>Aujourd'hui, nous transportons plus de 100 000 passagers par an et opérons des liaisons quotidiennes vers plus de 30 destinations au Maroc et en France. Notre flotte moderne de plus de 50 autobus garantit un voyage sûr et confortable.</p>`
                  )
                }}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {getContent('a-propos', 'valeurs_title', 'Nos Valeurs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {getContent('a-propos', 'valeur1_title', 'Sécurité')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getContent('a-propos', 'valeur1_description', 
                      'La sécurité de nos passagers est notre priorité absolue. Nos véhicules sont régulièrement entretenus et nos chauffeurs sont formés aux plus hauts standards.'
                    )
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  {getContent('a-propos', 'valeur2_title', 'Service Client')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getContent('a-propos', 'valeur2_description', 
                      "Notre équipe dédiée est disponible 24h/24 pour vous accompagner avant, pendant et après votre voyage. Votre satisfaction est notre réussite."
                    )
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {getContent('a-propos', 'valeur3_title', 'Accessibilité')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getContent('a-propos', 'valeur3_description', 
                      'Nous rendons les voyages accessibles à tous avec des tarifs compétitifs et des options de paiement flexibles pour connecter les communautés.'
                    )
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {getContent('a-propos', 'chiffres_title', 'Go Maroc en Chiffres')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('a-propos', 'chiffre1_nombre', '15+')}
                </div>
                <p className="text-muted-foreground">
                  {getContent('a-propos', 'chiffre1_label', "Années d'expérience")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('a-propos', 'chiffre2_nombre', '100K+')}
                </div>
                <p className="text-muted-foreground">
                  {getContent('a-propos', 'chiffre2_label', 'Passagers par an')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('a-propos', 'chiffre3_nombre', '50+')}
                </div>
                <p className="text-muted-foreground">
                  {getContent('a-propos', 'chiffre3_label', 'Autobus modernes')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getContent('a-propos', 'chiffre4_nombre', '30+')}
                </div>
                <p className="text-muted-foreground">
                  {getContent('a-propos', 'chiffre4_label', 'Destinations')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="h-6 w-6" />
                {getContent('a-propos', 'engagement_title', 'Notre Engagement')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: getContent('a-propos', 'engagement_description', 
                    "Go Maroc s'engage à maintenir les plus hauts standards de qualité et de service. Nous investissons continuellement dans notre flotte, notre technologie et la formation de notre personnel pour offrir une expérience de voyage exceptionnelle."
                  )
                }}
              />
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">{getContent('a-propos', 'badge1', 'Certification ISO 9001')}</Badge>
                <Badge variant="secondary">{getContent('a-propos', 'badge2', 'Flotte Euro 6')}</Badge>
                <Badge variant="secondary">{getContent('a-propos', 'badge3', 'Service 24/7')}</Badge>
                <Badge variant="secondary">{getContent('a-propos', 'badge4', 'Assurance voyage incluse')}</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;