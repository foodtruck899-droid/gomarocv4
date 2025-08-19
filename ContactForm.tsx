import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { getContent } = useSiteContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
      
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/90 hover:bg-white text-foreground h-16 justify-start px-6 transition-all hover:scale-105">
          <div className="text-left">
            <div className="font-semibold">Aide</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getContent('contact', 'form_title', 'Contactez-nous')}</DialogTitle>
          <DialogDescription>
            {getContent('contact', 'form_description', 'Une question ? Un problème ? Notre équipe est là pour vous aider')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">{getContent('contact', 'name_label', 'Nom complet')} <span className="text-destructive" aria-label="requis">*</span></Label>
              <Input
                id="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                aria-required="true"
                aria-describedby="name-description"
                autoComplete="name"
              />
              <span id="name-description" className="sr-only">
                Votre nom complet est requis pour traiter votre demande
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{getContent('contact', 'email_label', 'Email')} <span className="text-destructive" aria-label="requis">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                aria-required="true"
                aria-describedby="email-description"
                autoComplete="email"
              />
              <span id="email-description" className="sr-only">
                Votre adresse email pour recevoir notre réponse
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              aria-describedby="phone-description"
              autoComplete="tel"
            />
            <span id="phone-description" className="text-xs text-muted-foreground">
              Optionnel - pour vous joindre rapidement si nécessaire
            </span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">{getContent('contact', 'subject_label', 'Sujet')}</Label>
            <Select 
              value={formData.subject} 
              onValueChange={(value) => handleInputChange('subject', value)}
            >
              <SelectTrigger aria-describedby="subject-description">
                <SelectValue placeholder="Choisissez un sujet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reservation">Problème de réservation</SelectItem>
                <SelectItem value="voyage">Question sur un voyage</SelectItem>
                <SelectItem value="annulation">Annulation/Modification</SelectItem>
                <SelectItem value="remboursement">Demande de remboursement</SelectItem>
                <SelectItem value="technique">Problème technique</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            <span id="subject-description" className="text-xs text-muted-foreground">
              Sélectionnez le sujet qui correspond le mieux à votre demande
            </span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">{getContent('contact', 'message_label', 'Message')} <span className="text-destructive" aria-label="requis">*</span></Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre demande en détail..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="min-h-[80px] resize-none"
              required
              aria-required="true"
              aria-describedby="message-description"
            />
            <span id="message-description" className="text-xs text-muted-foreground">
              Décrivez votre demande avec le plus de détails possible pour une réponse adaptée
            </span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-primary" 
            disabled={isLoading}
            aria-describedby={isLoading ? "loading-description" : undefined}
          >
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            {isLoading ? "Envoi en cours..." : getContent('contact', 'submit_button', 'Envoyer le message')}
          </Button>
          {isLoading && (
            <span id="loading-description" className="sr-only">
              Votre message est en cours d'envoi, veuillez patienter
            </span>
          )}
        </form>
        
        <div className="mt-4 pt-3 border-t">
          <h4 className="font-medium mb-2 text-sm">Autre moyen de contact</h4>
          <div className="space-y-1 text-xs">
            <a 
              href="https://wa.me/33123456789?text=Bonjour,%20j'ai%20une%20question%20concernant%20Go%20Maroc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-green-600 transition-colors cursor-pointer"
            >
              <MessageCircle className="mr-2 h-3 w-3 text-green-600" />
              <span>Service client WhatsApp (disponible 24h/24)</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}