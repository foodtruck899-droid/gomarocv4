import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Gift, Mail, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GiftCardSuccess = () => {
  const [searchParams] = useSearchParams();
  const giftCardCode = searchParams.get('code');
  const [giftCard, setGiftCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (giftCardCode) {
      verifyPayment();
    }
  }, [giftCardCode]);

  const verifyPayment = async () => {
    if (!giftCardCode) return;

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-gift-card-payment', {
        body: { gift_card_code: giftCardCode }
      });

      if (error) throw error;

      if (data.verified) {
        setGiftCard(data.gift_card);
        toast.success("Paiement confirmé ! Votre carte cadeau est maintenant active.");
      } else {
        toast.error("Le paiement n'est pas encore confirmé. Veuillez patienter quelques instants.");
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error);
      toast.error("Erreur lors de la vérification du paiement");
    } finally {
      setIsVerifying(false);
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (giftCard?.code) {
      navigator.clipboard.writeText(giftCard.code);
      toast.success("Code copié dans le presse-papier !");
    }
  };

  const downloadCard = () => {
    // Créer un document PDF simple ou une image
    const cardText = `
CARTE CADEAU GO MAROC

Code: ${giftCard?.code}
Montant: ${giftCard?.amount}€
Valable jusqu'au: ${new Date(giftCard?.expires_at).toLocaleDateString('fr-FR')}

Utilisable sur tous nos trajets France-Maroc
www.gomaroc.com
    `;

    const blob = new Blob([cardText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carte-cadeau-${giftCard?.code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Vérification du paiement...</h1>
            <p className="text-muted-foreground">Veuillez patienter pendant que nous confirmons votre achat.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!giftCard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Erreur</h1>
            <p className="text-muted-foreground mb-6">
              Impossible de récupérer les informations de votre carte cadeau.
            </p>
            <Button onClick={() => window.location.href = '/gift-cards'} variant="outline">
              Retour aux cartes cadeaux
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">Achat Réussi !</h1>
          <p className="text-xl text-muted-foreground">
            Votre carte cadeau Go Maroc a été créée avec succès
          </p>
        </div>

        {/* Gift Card Display */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Carte Cadeau Go Maroc</CardTitle>
            <CardDescription className="text-lg">
              Valeur : <span className="font-bold text-primary">{giftCard.amount}€</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Code de la carte */}
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-primary/30 text-center">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Code de la carte cadeau
              </label>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-mono font-bold text-primary tracking-wider">
                  {giftCard.code}
                </span>
                <Button onClick={copyCode} size="sm" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Détails de la carte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Détails de la carte</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Montant :</span>
                    <span className="font-bold">{giftCard.amount}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Devise :</span>
                    <span>{giftCard.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut :</span>
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expire le :</span>
                    <span>{new Date(giftCard.expires_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {(giftCard.recipient_name || giftCard.recipient_email) && (
                <div>
                  <h3 className="font-semibold mb-3">Destinataire</h3>
                  <div className="space-y-2 text-sm">
                    {giftCard.recipient_name && (
                      <div className="flex justify-between">
                        <span>Nom :</span>
                        <span>{giftCard.recipient_name}</span>
                      </div>
                    )}
                    {giftCard.recipient_email && (
                      <div className="flex justify-between">
                        <span>Email :</span>
                        <span>{giftCard.recipient_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {giftCard.message && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Message personnel</h3>
                <p className="text-muted-foreground italic">"{giftCard.message}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button onClick={downloadCard} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
          
          <Button 
            onClick={() => window.print()} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/route-search'} 
            className="flex items-center gap-2"
          >
            <Gift className="h-4 w-4" />
            Utiliser maintenant
          </Button>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Comment utiliser votre carte cadeau ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Recherchez votre voyage</h4>
                  <p className="text-muted-foreground text-sm">
                    Allez sur notre page de recherche et sélectionnez votre trajet désiré.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Entrez votre code</h4>
                  <p className="text-muted-foreground text-sm">
                    Lors du paiement, entrez le code <strong>{giftCard.code}</strong> dans le champ "Carte cadeau".
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Profitez de votre voyage</h4>
                  <p className="text-muted-foreground text-sm">
                    Le montant sera automatiquement déduit de votre réservation !
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default GiftCardSuccess;