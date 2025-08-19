import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import profilePlaceholder from "@/assets/profile-placeholder.png";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar_url: string;
  order_index: number;
}

const CustomerTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Ce que disent nos clients");

  useEffect(() => {
    loadTestimonials();
    loadSectionTitle();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'customer_testimonials')
        .eq('content_type', 'testimonial')
        .order('key');

      if (error) throw error;

      const testimonialsData = data?.map((item, index) => {
        const content = JSON.parse(item.value || '{}');
        return {
          id: item.id,
          name: content.name || `Client ${index + 1}`,
          location: content.location || 'Maroc',
          rating: content.rating || 5,
          comment: content.comment || 'Excellent service !',
          avatar_url: content.avatar_url || '/lovable-uploads/a83a4e81-cf9f-4146-b463-8299b07aef81.png',
          order_index: index
        };
      }) || [];

      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
    }
  };

  const loadSectionTitle = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('section', 'customer_testimonials')
        .eq('key', 'section_title')
        .single();

      if (error) throw error;
      if (data?.value) setSectionTitle(data.value);
    } catch (error) {
      console.error('Erreur lors du chargement du titre:', error);
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {sectionTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 opacity-20"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground italic">
                  "{testimonial.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;