import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [footerContent, setFooterContent] = useState<any>({});

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'footer');
      
      if (data) {
        const content: any = {};
        data.forEach(item => {
          content[item.key] = item.value;
        });
        setFooterContent(content);
      }
    } catch (error) {
      console.error('Erreur chargement footer:', error);
    }
  };

  const getContent = (key: string, defaultValue: string = '') => {
    return footerContent[key] || defaultValue;
  };

  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{getContent('section_company_title', 'Entreprise')}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-primary transition-colors">{getContent('company_about', 'À propos de Go Maroc')}</Link></li>
              <li><Link to="/careers" className="text-sm hover:text-primary transition-colors">{getContent('company_careers', 'Carrières')}</Link></li>
              <li><Link to="/press" className="text-sm hover:text-primary transition-colors">{getContent('company_press', 'Presse')}</Link></li>
              <li><Link to="/gift-cards" className="text-sm hover:text-primary transition-colors">{getContent('company_giftcards', 'Cartes cadeaux')}</Link></li>
            </ul>
          </div>

          {/* Travel */}
          <div>
            <h4 className="font-semibold mb-4">{getContent('section_travel_title', 'Voyage')}</h4>
            <ul className="space-y-2">
              <li><Link to="/popular-routes" className="text-sm hover:text-primary transition-colors">{getContent('travel_routes', 'Itinéraires populaires')}</Link></li>
              <li><Link to="/bus-stations" className="text-sm hover:text-primary transition-colors">{getContent('travel_stations', 'Gares routières')}</Link></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{getContent('travel_app', 'App Go Maroc')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{getContent('travel_groups', 'Voyages de groupe')}</a></li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-semibold mb-4">{getContent('section_service_title', 'Service')}</h4>
            <ul className="space-y-2">
              <li><a href={getContent('service_help_url', '#')} className="text-sm hover:text-primary transition-colors">{getContent('service_help', 'Centre d\'aide')}</a></li>
              <li><a href={getContent('service_booking_url', '#')} className="text-sm hover:text-primary transition-colors">{getContent('service_booking', 'Gérer ma réservation')}</a></li>
              <li><a href={getContent('service_tracking_url', '#')} className="text-sm hover:text-primary transition-colors">{getContent('service_tracking', 'Suivi de voyage')}</a></li>
              <li><a href={getContent('service_contact_url', '#')} className="text-sm hover:text-primary transition-colors">{getContent('service_contact', 'Nous contacter')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{getContent('section_legal_title', 'Légal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm hover:text-primary transition-colors">{getContent('legal_terms', 'Conditions générales')}</Link></li>
              <li><Link to="/privacy-policy" className="text-sm hover:text-primary transition-colors">{getContent('legal_privacy', 'Politique de confidentialité')}</Link></li>
              <li><Link to="/legal-mentions" className="text-sm hover:text-primary transition-colors">{getContent('legal_mentions', 'Mentions légales')}</Link></li>
              <li><Link to="/cookies" className="text-sm hover:text-primary transition-colors">{getContent('legal_cookies', 'Gestion des cookies')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            {getContent('copyright', '© 2024 Go Maroc. Tous droits réservés.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;