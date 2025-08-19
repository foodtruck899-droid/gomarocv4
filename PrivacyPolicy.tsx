import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, Lock } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const PrivacyPolicy = () => {
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
            {getContent('politique-confidentialite', 'title', 'Politique de confidentialité')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('politique-confidentialite', 'subtitle', 'Protection de vos données personnelles')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Collecte des données */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>{getContent('politique-confidentialite', 'collecte_title', 'Collecte des données')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('politique-confidentialite', 'collecte_donnees', 
                    `<p>Nous collectons les données personnelles suivantes :</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Informations d'identification (nom, prénom, email)</li>
                      <li>Informations de contact (téléphone, adresse)</li>
                      <li>Données de voyage (destinations, dates, préférences)</li>
                      <li>Informations de paiement (cryptées et sécurisées)</li>
                    </ul>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Utilisation des données */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>{getContent('politique-confidentialite', 'utilisation_title', 'Utilisation des données')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('politique-confidentialite', 'utilisation_donnees', 
                    `<p>Vos données personnelles sont utilisées pour :</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Traitement et gestion de vos réservations</li>
                      <li>Communication relative à votre voyage</li>
                      <li>Amélioration de nos services</li>
                      <li>Respect des obligations légales</li>
                      <li>Envoi d'informations commerciales (avec votre consentement)</li>
                    </ul>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Droits des utilisateurs */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{getContent('politique-confidentialite', 'droits_title', 'Vos droits')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('politique-confidentialite', 'droits_utilisateurs', 
                    `<p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Droit d'accès à vos données personnelles</li>
                      <li>Droit de rectification des données inexactes</li>
                      <li>Droit à l'effacement de vos données</li>
                      <li>Droit à la limitation du traitement</li>
                      <li>Droit à la portabilité de vos données</li>
                      <li>Droit d'opposition au traitement</li>
                    </ul>
                    <p>Pour exercer ces droits, contactez-nous à : contact@gomaroc.fr</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>{getContent('politique-confidentialite', 'securite_title', 'Sécurité des données')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('politique-confidentialite', 'securite_donnees', 
                    `<p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles :</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Chiffrement des données sensibles</li>
                      <li>Accès restreint aux données personnelles</li>
                      <li>Surveillance continue de nos systèmes</li>
                      <li>Formations régulières de notre personnel</li>
                      <li>Audits de sécurité périodiques</li>
                    </ul>`
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

export default PrivacyPolicy;