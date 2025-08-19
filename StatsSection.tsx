import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const StatsSection = () => {
  const [statsContent, setStatsContent] = useState({
    main_title: "Premier choix de voyage pour 2+ millions de personnes en 2024.",
    destinations_number: "50+",
    destinations_label: "Destinations",
    countries_number: "2",
    countries_label: "Pays",
    clients_number: "2M+",
    clients_label: "Clients satisfaits",
    year_number: "2024",
    year_label: "Cette année"
  });

  useEffect(() => {
    const loadStatsContent = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value')
          .eq('section', 'stats');
        
        if (data) {
          const contentMap = data.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
          
          setStatsContent(prev => ({
            ...prev,
            ...contentMap
          }));
        }
      } catch (error) {
        console.error('Error loading stats content:', error);
      }
    };

    loadStatsContent();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {statsContent.main_title}
        </h2>
        
        {/* Trust indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group hover:scale-105 transition-all">
            <div className="text-2xl font-bold text-primary">{statsContent.destinations_number}</div>
            <div className="text-sm text-muted-foreground">{statsContent.destinations_label}</div>
          </div>
          <div className="text-center group hover:scale-105 transition-all">
            <div className="text-2xl font-bold text-primary">{statsContent.countries_number}</div>
            <div className="text-sm text-muted-foreground">{statsContent.countries_label}</div>
          </div>
          <div className="text-center group hover:scale-105 transition-all">
            <div className="text-2xl font-bold text-primary">{statsContent.clients_number}</div>
            <div className="text-sm text-muted-foreground">{statsContent.clients_label}</div>
          </div>
          <div className="text-center group hover:scale-105 transition-all">
            <div className="text-2xl font-bold text-primary">{statsContent.year_number}</div>
            <div className="text-sm text-muted-foreground">{statsContent.year_label}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;