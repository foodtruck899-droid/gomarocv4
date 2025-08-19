import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, Users, CreditCard } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Terms = () => {
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
            {getContent('conditions-generales', 'title', 'Conditions d\'utilisation')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('conditions-generales', 'last_updated', 'Dernière mise à jour : 10 août 2025')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{getContent('conditions-generales', 'section1_title', 'Objet et champ d\'application')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="text-sm space-y-4" 
                dangerouslySetInnerHTML={{
                  __html: getContent('conditions-generales', 'introduction', 
                    `<p>Les présentes conditions générales de vente et d'utilisation (ci-après "CGV") régissent les relations entre GO MAROC, société de transport de voyageurs, et ses clients dans le cadre de la vente de titres de transport.</p>
                    <p>L'acceptation des présentes CGV est matérialisée par la validation de votre commande. Cette acceptation entraîne l'adhésion entière et sans réserve du client aux présentes CGV.</p>`
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Réservation et paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>{getContent('conditions-generales', 'section2_title', 'Réservation et paiement')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('conditions-generales', 'section2_contenu', 
                    `<div>
                      <h3 class="font-semibold mb-2">Modalités de réservation</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Les réservations peuvent être effectuées en ligne, par téléphone ou en agence</li>
                        <li>Toute réservation doit être confirmée par un paiement intégral</li>
                        <li>Les places sont attribuées dans l'ordre des réservations confirmées</li>
                      </ul>
                    </div>
                    <hr class="my-4 border-border" />
                    <div>
                      <h3 class="font-semibold mb-2">Paiement</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Paiement sécurisé par carte bancaire, virement ou espèces en agence</li>
                        <li>Le paiement vaut acceptation des présentes conditions</li>
                        <li>Aucun voyage ne peut débuter sans paiement préalable intégral</li>
                      </ul>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{getContent('conditions-generales', 'section3_title', 'Conditions de voyage')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('conditions-generales', 'section3_contenu', 
                    `<div>
                      <h3 class="font-semibold mb-2">Documents requis</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Passeport en cours de validité obligatoire</li>
                        <li>Visa si requis selon la nationalité du voyageur</li>
                        <li>Il incombe au voyageur de s'assurer de la validité de ses documents</li>
                      </ul>
                    </div>
                    <hr class="my-4 border-border" />
                    <div>
                      <h3 class="font-semibold mb-2">Bagages</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>1 bagage à main (8kg max) et 1 bagage en soute (23kg max) inclus</li>
                        <li>Objets de valeur et documents importants à conserver avec soi</li>
                        <li>GO MAROC décline toute responsabilité pour les objets fragiles non déclarés</li>
                      </ul>
                    </div>
                    <hr class="my-4 border-border" />
                    <div>
                      <h3 class="font-semibold mb-2">Comportement à bord</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Respect des autres voyageurs et du personnel</li>
                        <li>Interdiction de fumer, consommer de l'alcool</li>
                        <li>Tout comportement inapproprié peut entraîner l'exclusion du voyage</li>
                      </ul>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {getContent('conditions-generales', 'section4_title', 'Annulation et modification')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('conditions-generales', 'section4_contenu', 
                    `<div>
                      <h3 class="font-semibold mb-2">Modification par le client</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Modification possible jusqu'à 24h avant le départ</li>
                        <li>Frais de modification : 25€ (tarif Standard), gratuit (tarif Flexible)</li>
                        <li>Sous réserve de disponibilité</li>
                      </ul>
                    </div>
                    <hr class="my-4 border-border" />
                    <div>
                      <h3 class="font-semibold mb-2">Annulation par le client</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Plus de 48h avant : remboursement intégral moins 30€ de frais</li>
                        <li>Entre 48h et 24h : remboursement de 50%</li>
                        <li>Moins de 24h : aucun remboursement</li>
                      </ul>
                    </div>
                    <hr class="my-4 border-border" />
                    <div>
                      <h3 class="font-semibold mb-2">Annulation par GO MAROC</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Remboursement intégral en cas d'annulation de notre fait</li>
                        <li>Report sur un autre départ sans frais supplémentaires</li>
                        <li>Information du client dans les meilleurs délais</li>
                      </ul>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{getContent('conditions-generales', 'section5_title', 'Responsabilité et assurance')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('conditions-generales', 'section5_contenu', 
                    `<div>
                      <h3 class="font-semibold mb-2">Responsabilité de GO MAROC</h3>
                      <ul class="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Assurance responsabilité civile et assurance voyageurs</li>
                        <li>Indemnisation selon les conventions internationales en vigueur</li>
                        <li>Exclusion en cas de force majeure ou fait du prince</li>
                      </ul>
                    </div>
                    <hr class="my-4 border-border" />
                    <div>
                      <h3 class="font-semibold mb-2">Assurance voyage</h3>
                      <p class="text-sm text-muted-foreground">Il est fortement recommandé de souscrire une assurance voyage couvrant notamment l'annulation, l'assistance rapatriement et la responsabilité civile à l'étranger.</p>
                    </div>`
                  )
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {getContent('conditions-generales', 'section6_title', 'Litiges et médiation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{
                  __html: getContent('conditions-generales', 'section6_contenu', 
                    `<p class="text-sm">En cas de litige, le client peut s'adresser au service client GO MAROC. À défaut de solution amiable, le client peut saisir le médiateur du tourisme et du voyage.</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 class="font-semibold">GO MAROC</h4>
                        <p>123 Avenue de la République<br />75011 Paris, France</p>
                      </div>
                      <div>
                        <h4 class="font-semibold">Contact</h4>
                        <p>Tél : +33 1 23 45 67 89<br />Email : contact@gomaroc.fr</p>
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

export default Terms;