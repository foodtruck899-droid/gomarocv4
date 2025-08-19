import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, BarChart, Target } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Cookies = () => {
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
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getContent('cookies', 'title', 'Politique des cookies')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('cookies', 'subtitle', 'Information sur l\'utilisation des cookies')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Qu'est-ce qu'un cookie */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Cookie className="h-5 w-5" />
                <span>{getContent('cookies', 'definition_title', 'Qu\'est-ce qu\'un cookie ?')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('cookies', 'definition', 
                    `<p>Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d'un site internet. Il permet au site de mémoriser des informations sur votre visite, comme votre langue de préférence et d'autres paramètres.</p>
                    <p>Cela peut faciliter votre visite suivante et rendre le site plus utile.</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Types de cookies */}
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <Settings className="h-5 w-5" />
                 <span>{getContent('cookies', 'types_title', 'Types de cookies utilisés')}</span>
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('cookies', 'types_cookies', 
                    `<h3 class="font-semibold">Cookies nécessaires</h3>
                    <p>Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.</p>
                    
                    <h3 class="font-semibold mt-4">Cookies de performance</h3>
                    <p>Ces cookies nous permettent d'améliorer le fonctionnement du site en analysant son utilisation.</p>
                    
                    <h3 class="font-semibold mt-4">Cookies fonctionnels</h3>
                    <p>Ces cookies permettent d'améliorer l'expérience utilisateur en mémorisant vos préférences.</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Gestion des cookies */}
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <Target className="h-5 w-5" />
                 <span>{getContent('cookies', 'gestion_title', 'Gestion de vos cookies')}</span>
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('cookies', 'gestion_cookies', 
                    `<p>Vous pouvez gérer vos préférences de cookies de plusieurs façons :</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Via le bandeau de consentement lors de votre première visite</li>
                      <li>En modifiant les paramètres de votre navigateur</li>
                      <li>En utilisant les outils de gestion des cookies de notre site</li>
                    </ul>
                    <p><strong>Attention :</strong> La désactivation de certains cookies peut affecter le fonctionnement du site.</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Partenaires */}
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <BarChart className="h-5 w-5" />
                 <span>{getContent('cookies', 'tiers_title', 'Cookies tiers')}</span>
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('cookies', 'cookies_tiers', 
                    `<p>Nous utilisons également des cookies de partenaires tiers pour :</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Mesurer l'audience (Google Analytics)</li>
                      <li>Améliorer l'expérience utilisateur</li>
                      <li>Afficher des publicités pertinentes</li>
                      <li>Intégrer des réseaux sociaux</li>
                    </ul>
                    <p>Ces partenaires ont leurs propres politiques de confidentialité que nous vous encourageons à consulter.</p>`
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

export default Cookies;