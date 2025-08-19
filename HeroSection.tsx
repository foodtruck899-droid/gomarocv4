import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from "lucide-react";
import heroImage from "@/assets/hero-bus-maroc.jpg";
import CityAutocomplete from "@/components/CityAutocomplete";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { PassengerSelector } from "@/components/PassengerSelector";
import { BookingManagement } from "@/components/BookingManagement";
import { BookingTracking } from "@/components/BookingTracking";
import { ContactForm } from "@/components/ContactForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [tripType, setTripType] = useState("one-way");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [departureTime, setDepartureTime] = useState("");
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [heroContent, setHeroContent] = useState({
    title: "Voyagez avec Go Maroc",
    subtitle: "Des trajets confortables et sûrs entre le Maroc et...",
    description: "Réservez votre voyage en bus facilement et profitez...",
    cta_button: "Réserver maintenant"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value')
          .eq('section', 'hero');
        
        if (data) {
          const contentMap = data.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
          
          setHeroContent(prev => ({
            ...prev,
            ...contentMap
          }));
        }
      } catch (error) {
        console.error('Error loading hero content:', error);
      }
    };

    loadHeroContent();
  }, []);

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      return;
    }

    // Construire les paramètres de recherche
    const searchParams = new URLSearchParams();
    searchParams.set("from", fromCity);
    searchParams.set("to", toCity);
    searchParams.set("adults", passengers.adults.toString());
    searchParams.set("children", passengers.children.toString());
    searchParams.set("tripType", tripType);
    
    if (departureDate) {
      // Utiliser la date locale sans conversion de fuseau horaire
      const year = departureDate.getFullYear();
      const month = String(departureDate.getMonth() + 1).padStart(2, '0');
      const day = String(departureDate.getDate()).padStart(2, '0');
      searchParams.set("date", `${year}-${month}-${day}`);
    }
    
    if (departureTime) {
      searchParams.set("time", departureTime);
    }

    // Naviguer vers la page de résultats
    navigate(`/search-results?${searchParams.toString()}`);
  };

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <section 
      className="relative w-full min-h-[600px] sm:min-h-[700px] md:min-h-[800px] flex items-center bg-no-repeat bg-scroll bg-[length:105%_auto] bg-[center_0%] sm:bg-cover sm:bg-[center_5%]"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${heroImage})`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="max-w-4xl animate-fade-in pt-8 sm:pt-12 md:pt-16">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight drop-shadow-lg">
            {heroContent.title}
          </h1>
          <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 md:mb-8 opacity-90 leading-relaxed drop-shadow-lg">
            {heroContent.subtitle}
          </h2>
          <p className="text-white text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-80 leading-relaxed drop-shadow-lg">
            {heroContent.description}
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl animate-warm-glow">
            {/* Trip Type */}
            <RadioGroup value={tripType} onValueChange={setTripType} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label htmlFor="one-way" className="text-sm font-medium">Aller simple</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <Label htmlFor="round-trip" className="text-sm font-medium">Aller-retour</Label>
              </div>
            </RadioGroup>

            {/* Search Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* From */}
              <div className="sm:col-span-1 lg:col-span-1">
                <CityAutocomplete
                  label="Départ"
                  placeholder="Paris, France"
                  value={fromCity}
                  onChange={setFromCity}
                />
              </div>

              {/* Switch Icon */}
              <div className="flex items-end justify-center pb-3 sm:col-span-2 lg:col-span-1 order-3 sm:order-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={handleSwapCities}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="sm:col-span-1 lg:col-span-1 order-2 sm:order-3">
                <CityAutocomplete
                  label="Arrivée"
                  placeholder="Casablanca, Maroc"
                  value={toCity}
                  onChange={setToCity}
                />
              </div>

              {/* Departure Date */}
              <div className="sm:col-span-1 lg:col-span-2 order-4">
                <DatePicker
                  label="Date de départ"
                  placeholder="Choisir une date"
                  value={departureDate}
                  onChange={setDepartureDate}
                  minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>


              {/* Passengers */}
              <div className="sm:col-span-1 lg:col-span-1 order-6">
                <PassengerSelector
                  label="Passagers"
                  placeholder="1 Adulte"
                  value={passengers}
                  onChange={setPassengers}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-4 sm:mt-6">
              <Button 
                onClick={handleSearch}
                disabled={!fromCity || !toCity}
                className="w-full sm:w-auto px-8 sm:px-12 h-10 sm:h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                {heroContent.cta_button}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 sm:mt-6">
            <BookingManagement />
            <BookingTracking />
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;