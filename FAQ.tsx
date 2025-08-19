import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const FAQ = () => {
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
            {getContent('faq', 'title', 'Questions fréquentes')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('faq', 'subtitle', 'Trouvez rapidement les réponses à vos questions')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Contact rapide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>{getContent('faq', 'aide_title', 'Besoin d\'aide immédiate ?')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('faq', 'contact_rapide', 
                    `<button class="flex items-center space-x-2 h-auto py-3 px-4 border rounded">
                      <span>📞</span>
                      <div class="text-left">
                        <div class="font-semibold">Appelez-nous</div>
                        <div class="text-xs">+33 1 23 45 67 89</div>
                      </div>
                    </button>
                    <button class="flex items-center space-x-2 h-auto py-3 px-4 border rounded">
                      <span>💬</span>
                      <div class="text-left">
                        <div class="font-semibold">Chat en direct</div>
                        <div class="text-xs">Disponible 24h/24</div>
                      </div>
                    </button>
                    <button class="flex items-center space-x-2 h-auto py-3 px-4 border rounded">
                      <span>✉️</span>
                      <div class="text-left">
                        <div class="font-semibold">Email</div>
                        <div class="text-xs">support@gomaroc.fr</div>
                      </div>
                    </button>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* FAQ par catégorie */}
          <div className="space-y-6">
            <div 
              dangerouslySetInnerHTML={{
                __html: getContent('faq', 'faq_contenu', 
                  `<div class="space-y-6">
                    <div class="border rounded-lg">
                      <h3 class="p-4 font-semibold border-b">Réservation</h3>
                      <div class="p-4 space-y-4">
                        <div>
                          <h4 class="font-medium mb-2">Comment réserver un billet ?</h4>
                          <p class="text-sm text-muted-foreground">Vous pouvez réserver directement sur notre site web, par téléphone au +33 1 23 45 67 89, ou dans nos agences partenaires. La réservation en ligne est disponible 24h/24.</p>
                        </div>
                        <div>
                          <h4 class="font-medium mb-2">Puis-je modifier ma réservation ?</h4>
                          <p class="text-sm text-muted-foreground">Oui, vous pouvez modifier votre réservation jusqu'à 24h avant le départ. Des frais de modification peuvent s'appliquer selon le tarif choisi.</p>
                        </div>
                        <div>
                          <h4 class="font-medium mb-2">Comment annuler ma réservation ?</h4>
                          <p class="text-sm text-muted-foreground">L'annulation est possible jusqu'à 48h avant le départ. Les frais d'annulation varient selon le tarif : Standard (30€), Flexible (gratuit), Premium (gratuit).</p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="border rounded-lg">
                      <h3 class="p-4 font-semibold border-b">Bagages</h3>
                      <div class="p-4 space-y-4">
                        <div>
                          <h4 class="font-medium mb-2">Quelle est la limite de bagages ?</h4>
                          <p class="text-sm text-muted-foreground">Chaque passager a droit à 1 bagage à main (8kg max) et 1 bagage en soute (23kg max). Des bagages supplémentaires peuvent être ajoutés moyennant supplément.</p>
                        </div>
                        <div>
                          <h4 class="font-medium mb-2">Que faire si mon bagage est perdu ?</h4>
                          <p class="text-sm text-muted-foreground">Signalez immédiatement la perte à notre équipe. Nous localisons 95% des bagages perdus dans les 24h. Une indemnisation est prévue selon nos conditions générales.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="border rounded-lg">
                      <h3 class="p-4 font-semibold border-b">Voyage</h3>
                      <div class="p-4 space-y-4">
                        <div>
                          <h4 class="font-medium mb-2">Quels documents sont nécessaires ?</h4>
                          <p class="text-sm text-muted-foreground">Pour voyager entre la France et le Maroc, vous devez avoir un passeport en cours de validité. Vérifiez les exigences de visa selon votre nationalité.</p>
                        </div>
                        <div>
                          <h4 class="font-medium mb-2">Peut-on voyager avec des enfants ?</h4>
                          <p class="text-sm text-muted-foreground">Oui, les enfants sont les bienvenus. Les moins de 2 ans voyagent gratuitement sur les genoux. Les enfants de 2 à 12 ans bénéficient d'une réduction de 25%.</p>
                        </div>
                      </div>
                    </div>
                  </div>`
                )
              }}
            />
          </div>

          {/* Section contact */}
          <Card>
            <CardHeader>
              <CardTitle>
                {getContent('faq', 'contact_title', 'Votre question n\'est pas listée ?')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{
                  __html: getContent('faq', 'contact_description', 
                    `<p class="text-muted-foreground mb-4">Notre équipe de support est là pour vous aider. N'hésitez pas à nous contacter pour toute question spécifique.</p>
                    <button class="bg-primary text-primary-foreground px-4 py-2 rounded">Nous contacter</button>`
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

export default FAQ;