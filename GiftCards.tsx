import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Heart, MapPin, Calendar, Check, CreditCard, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validatedCard, setValidatedCard] = useState<any>(null);

  const predefinedAmounts = [25, 50, 100, 200, 500];

  const handleAmountSelect = (amount: number) => {
    if (selectedAmount === amount) {
      // Si on clique sur le même montant, on le désélectionne
      setSelectedAmount(null);
    } else {
      setSelectedAmount(amount);
    }
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handlePurchase = async () => {
    const amount = getFinalAmount();
    
    if (!amount || amount < 10) {
      toast.error("Le montant minimum est de 10€");
      return;
    }

    if (!purchaserEmail || !purchaserName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('purchase-gift-card', {
        body: {
          amount,
          currency: 'EUR',
          purchaserEmail,
          purchaserName,
          recipientEmail: recipientEmail || null,
          recipientName: recipientName || null,
          message: message || null
        }
      });

      if (error) throw error;

      if (data.url) {
        // Ouvrir Stripe Checkout dans un nouvel onglet
        window.open(data.url, '_blank');
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'achat:', error);
      toast.error(error.message || "Erreur lors de l'achat de la carte cadeau");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidateCard = async () => {
    if (!validationCode.trim()) {
      toast.error("Veuillez entrer un code de carte cadeau");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-gift-card', {
        body: { code: validationCode.trim() }
      });

      if (error) throw error;

      if (data.valid) {
        setValidatedCard(data.gift_card);
        toast.success("Carte cadeau valide !");
      } else {
        toast.error(data.error || "Carte cadeau non valide");
        setValidatedCard(null);
      }

    } catch (error: any) {
      console.error('Erreur lors de la validation:', error);
      toast.error("Erreur lors de la validation de la carte cadeau");
      setValidatedCard(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Cartes Cadeaux Go Maroc
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Offrez le voyage parfait ! Nos cartes cadeaux permettent à vos proches de découvrir 
            le Maroc avec nos services de transport premium.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Section Achat */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Acheter une Carte Cadeau
              </CardTitle>
              <CardDescription>
                Choisissez le montant et personnalisez votre carte cadeau
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection du montant */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Montant de la carte cadeau</Label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className="h-12"
                    >
                      {amount}€
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Ou montant personnalisé (min. 10€)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10"
                    placeholder="Montant en euros"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    disabled={selectedAmount !== null}
                  />
                </div>
              </div>

              {/* Informations acheteur */}
              <div className="space-y-4">
                <h3 className="font-semibold">Vos informations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchaser-name">Nom complet *</Label>
                    <Input
                      id="purchaser-name"
                      value={purchaserName}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaser-email">Email *</Label>
                    <Input
                      id="purchaser-email"
                      type="email"
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Informations destinataire */}
              <div className="space-y-4">
                <h3 className="font-semibold">Destinataire (optionnel)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipient-name">Nom du destinataire</Label>
                    <Input
                      id="recipient-name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nom du destinataire"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipient-email">Email du destinataire</Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="destinataire@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Message personnalisé */}
              <div>
                <Label htmlFor="message">Message personnalisé (optionnel)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez un message personnel..."
                  rows={3}
                />
              </div>

              {/* Résumé et achat */}
              {getFinalAmount() > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Montant total :</span>
                    <span className="text-2xl font-bold text-primary">{getFinalAmount()}€</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valable 1 an • Utilisable en plusieurs fois
                  </p>
                </div>
              )}

              <Button 
                onClick={handlePurchase}
                disabled={!getFinalAmount() || isProcessing}
                className="w-full h-12"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {isProcessing ? "Traitement..." : `Acheter pour ${getFinalAmount()}€`}
              </Button>
            </CardContent>
          </Card>

          {/* Section Validation */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Vérifier une Carte Cadeau
              </CardTitle>
              <CardDescription>
                Entrez le code de votre carte cadeau pour vérifier son solde
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="validation-code">Code de la carte cadeau</Label>
                <Input
                  id="validation-code"
                  value={validationCode}
                  onChange={(e) => setValidationCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX"
                  className="font-mono text-center"
                />
              </div>

              <Button 
                onClick={handleValidateCard}
                disabled={!validationCode.trim() || isProcessing}
                className="w-full"
                variant="secondary"
              >
                {isProcessing ? "Vérification..." : "Vérifier la carte"}
              </Button>

              {validatedCard && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Carte cadeau valide</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Code :</span>
                      <span className="font-mono font-bold">{validatedCard.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solde disponible :</span>
                      <span className="font-bold text-green-600">{validatedCard.amount}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant initial :</span>
                      <span>{validatedCard.initial_amount}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expire le :</span>
                      <span>{new Date(validatedCard.expires_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {validatedCard.recipient_name && (
                      <div className="flex justify-between">
                        <span>Destinataire :</span>
                        <span>{validatedCard.recipient_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Avantages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir nos cartes cadeaux ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Flexibilité totale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utilisable en plusieurs fois sur tous nos trajets France-Maroc. 
                  Valable 1 an à partir de la date d'achat.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Tous les trajets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Valable sur l'ensemble de notre réseau : Paris, Lyon, Marseille, 
                  Toulouse vers Casablanca, Rabat, Marrakech, Agadir.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-500" />
                  Livraison instantanée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Code de carte cadeau envoyé immédiatement par email après 
                  paiement. Prêt à offrir en quelques minutes !
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment utiliser ma carte cadeau ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lors de votre réservation, entrez le code de votre carte cadeau. 
                  Le montant sera automatiquement déduit du prix total.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je utiliser plusieurs cartes ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, vous pouvez combiner plusieurs cartes cadeaux pour une même réservation 
                  et compléter avec un autre moyen de paiement si nécessaire.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il si j'annule ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  En cas d'annulation, le montant de la carte cadeau vous est recrédité 
                  et peut être réutilisé pour une future réservation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je offrir à quelqu'un d'autre ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolument ! Nos cartes cadeaux sont nominatives au destinataire que vous 
                  choisissez et peuvent être utilisées par cette personne.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GiftCards;