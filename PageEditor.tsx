import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PageContent {
  id: string;
  section: string;
  key: string;
  value: string;
  content_type: string;
}

const pages = [
  // Pages principales
  { value: 'about', label: 'À propos de Go Maroc' },
  { value: 'contact', label: 'Contact' },
  { value: 'careers', label: 'Carrières' },
  { value: 'press', label: 'Presse' },
  { value: 'terms', label: 'Conditions générales' },
  { value: 'privacy-policy', label: 'Politique de confidentialité' },
  { value: 'legal-mentions', label: 'Mentions légales' },
  { value: 'cookies', label: 'Gestion des cookies' },
  { value: 'destinations', label: 'Destinations' },
  { value: 'popular-routes', label: 'Itinéraires populaires' },
  { value: 'bus-stations', label: 'Gares routières' },
  { value: 'gift-cards', label: 'Cartes cadeaux' },
  { value: 'routes', label: 'Rechercher un trajet' },
  { value: 'schedules', label: 'Horaires & Tarifs' },
  // Services spécifiques de l'en-tête
  { value: 'bagages', label: 'Transport de bagages' },
  { value: 'assistance', label: 'Assistance passagers' },
  { value: 'premium', label: 'Services premium' },
  // Sections de la page d'accueil
  { value: 'hero', label: 'Section Héro (Accueil)' },
  { value: 'features', label: 'Section Fonctionnalités (Accueil)' },
  { value: 'stats', label: 'Section Statistiques (Accueil)' },
  { value: 'marketing', label: 'Section Marketing (Accueil)' },
  { value: 'testimonials', label: 'Témoignages Clients (Accueil)' },
  { value: 'footer', label: 'Pied de Page' },
  { value: 'header', label: 'En-tête/Navigation' }
];

export function PageEditor() {
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Charger le contenu de la page sélectionnée
  const loadPageContent = async (pageSection: string) => {
    if (!pageSection) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', pageSection)
        .order('key');

      if (error) throw error;

      setPageContent(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le contenu de la page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le contenu
  const updateContent = async (contentId: string, newValue: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ value: newValue })
        .eq('id', contentId);

      if (error) throw error;

      // Mettre à jour l'état local
      setPageContent(prev => 
        prev.map(item => 
          item.id === contentId ? { ...item, value: newValue } : item
        )
      );

      toast({
        title: "Contenu mis à jour",
        description: "Les modifications ont été sauvegardées.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Charger le contenu quand la page change
  useEffect(() => {
    if (selectedPage) {
      loadPageContent(selectedPage);
    }
  }, [selectedPage]);

  const renderContentField = (content: PageContent) => {
    const isTextarea = content.content_type === 'textarea' || content.value.length > 100;
    
    return (
      <div key={content.id} className="space-y-2">
        <Label htmlFor={content.id} className="text-sm font-medium">
          {content.key.replace(/_/g, ' ').toUpperCase()}
        </Label>
        {isTextarea ? (
          <Textarea
            id={content.id}
            value={content.value}
            onChange={(e) => updateContent(content.id, e.target.value)}
            className="min-h-[100px]"
            disabled={saving}
          />
        ) : (
          <Input
            id={content.id}
            value={content.value}
            onChange={(e) => updateContent(content.id, e.target.value)}
            disabled={saving}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Éditeur de Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-select">Sélectionner une page à modifier</Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez une page..." />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.value} value={page.value}>
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Contenu de: {pages.find(p => p.value === selectedPage)?.label}
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Chargement du contenu...</span>
                </div>
              ) : pageContent.length > 0 ? (
                <div className="space-y-4">
                  {pageContent.map(renderContentField)}
                  {saving && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sauvegarde en cours...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun contenu trouvé pour cette page.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}