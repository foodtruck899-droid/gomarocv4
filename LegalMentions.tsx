import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building, Phone, Mail, Globe } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const LegalMentions = () => {
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
            {getContent('mentions-legales', 'title', 'Mentions légales')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('mentions-legales', 'subtitle', 'Informations légales sur GO MAROC')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Éditeur du site */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>{getContent('mentions-legales', 'editeur_title', 'Éditeur du site')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('mentions-legales', 'editeur', 
                    `<p><strong>GO MAROC</strong><br/>
                    Société de transport de voyageurs<br/>
                    SIRET : 123 456 789 00012<br/>
                    Capital social : 50 000 €</p>
                    <p>Siège social :<br/>
                    123 Avenue de la République<br/>
                    75011 Paris, France</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>{getContent('mentions-legales', 'contact_title', 'Contact')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('mentions-legales', 'contact', 
                    `<p>Téléphone : +33 1 23 45 67 89<br/>
                    Email : contact@gomaroc.fr<br/>
                    Directeur de publication : Jean Dupont</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Hébergement */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{getContent('mentions-legales', 'hebergement_title', 'Hébergement')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('mentions-legales', 'hebergement', 
                    `<p>Ce site est hébergé par :<br/>
                    <strong>OVH</strong><br/>
                    SAS au capital de 10 174 560 €<br/>
                    RCS Lille Métropole 424 761 419 00045<br/>
                    Code APE 2620Z<br/>
                    N° TVA : FR 22 424 761 419</p>
                    <p>Siège social :<br/>
                    2 rue Kellermann<br/>
                    59100 Roubaix - France</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Propriété intellectuelle */}
          <Card>
            <CardHeader>
             <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{getContent('mentions-legales', 'propriete_title', 'Propriété intellectuelle')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('mentions-legales', 'propriete_intellectuelle', 
                    `<p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.</p>
                    <p>Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
                    <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>`
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

export default LegalMentions;