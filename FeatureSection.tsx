import { useState, useEffect } from "react";
import { Globe, Wifi, Calendar, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultFeatures = [
  {
    icon: Globe,
    title: "Voyagez entre deux continents",
    description: "Connexions directes entre le Maroc et la France. Découvrez nos liaisons régulières vers plus de 50 destinations."
  },
  {
    icon: Wifi,
    title: "Confort à bord",
    description: "Wi-Fi gratuit, prises électriques, sièges inclinables et espace pour les jambes. Le voyage fait partie du plaisir."
  },
  {
    icon: Calendar,
    title: "Réservez en toute simplicité",
    description: "De votre écran à votre siège en quelques clics. Vous réservez, nous nous occupons du reste."
  },
  {
    icon: Leaf,
    title: "Voyage éco-responsable",
    description: "Laissez la voiture, voyagez avec nous. Réduisez votre empreinte carbone tout en économisant."
  }
];

const FeatureSection = () => {
  const [content, setContent] = useState({
    title: "Pourquoi choisir Go Maroc ?",
    feature1_title: "Confort Premium",
    feature1_description: "Bus modernes avec climatisation, sièges inclinables et espace pour les jambes",
    feature2_title: "Sécurité Garantie", 
    feature2_description: "Conducteurs expérimentés et véhicules régulièrement contrôlés",
    feature3_title: "Prix Compétitifs",
    feature3_description: "Les meilleurs tarifs pour vos voyages entre le Maroc et l'Europe"
  });

  useEffect(() => {
    const loadFeatureContent = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value')
          .eq('section', 'features');
        
        if (data) {
          const contentMap = data.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
          
          setContent(prev => ({
            ...prev,
            ...contentMap
          }));
        }
      } catch (error) {
        console.error('Error loading feature content:', error);
      }
    };

    loadFeatureContent();
  }, []);

  const features = [
    {
      icon: Globe,
      title: content.feature1_title,
      description: content.feature1_description
    },
    {
      icon: Wifi,
      title: content.feature2_title,
      description: content.feature2_description
    },
    {
      icon: Calendar,
      title: content.feature3_title,
      description: content.feature3_description
    },
    {
      icon: Leaf,
      title: "Voyage éco-responsable",
      description: "Laissez la voiture, voyagez avec nous. Réduisez votre empreinte carbone tout en économisant."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;