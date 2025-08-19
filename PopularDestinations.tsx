import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Destination {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  image_url: string;
  order_index: number;
}

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Destinations populaires");

  useEffect(() => {
    loadDestinations();
    loadSectionTitle();
  }, []);

  const loadDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'popular_destinations')
        .eq('content_type', 'destination')
        .order('key');

      if (error) throw error;

      const destinationsData = data?.map((item, index) => {
        const content = JSON.parse(item.value || '{}');
        return {
          id: item.id,
          title: content.title || `Destination ${index + 1}`,
          location: content.location || 'Maroc',
          price: content.price || '€50',
          rating: content.rating || 5,
          reviews: content.reviews || 100,
          image_url: content.image_url || '/placeholder.svg',
          order_index: index
        };
      }) || [];

      setDestinations(destinationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des destinations:', error);
    }
  };

  const loadSectionTitle = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('section', 'popular_destinations')
        .eq('key', 'section_title')
        .single();

      if (error) throw error;
      if (data?.value) setSectionTitle(data.value);
    } catch (error) {
      console.error('Erreur lors du chargement du titre:', error);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {sectionTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={destination.image_url}
                  alt={destination.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{destination.title}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{destination.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < destination.rating ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({destination.reviews} avis)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      À partir de {destination.price}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;