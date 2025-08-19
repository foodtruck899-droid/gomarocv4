import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import StatsSection from "@/components/StatsSection";
import MarketingSection from "@/components/MarketingSection";
import PopularDestinations from "@/components/PopularDestinations";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import usePageOrder from "@/hooks/usePageOrder";

const Index = () => {
  const { sections, loading } = usePageOrder();

  // Mapping des composants
  const componentMap = {
    HeroSection,
    FeatureSection,
    StatsSection,
    MarketingSection,
    PopularDestinations,
    CustomerTestimonials
  };

  const renderSection = (componentName: string, index: number) => {
    const Component = componentMap[componentName as keyof typeof componentMap];
    if (!Component) return null;

    return (
      <div key={componentName} className={index === 0 ? "pt-4" : "pt-12"}>
        <Component />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {sections.map((section, index) => 
        renderSection(section.component, index)
      )}
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
