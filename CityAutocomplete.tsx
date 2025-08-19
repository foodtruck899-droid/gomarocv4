import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface City {
  name: string;
  country: string;
  flag?: string;
}

interface CityAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const popularCities: City[] = [
  { name: "Paris", country: "France", flag: "🇫🇷" },
  { name: "Lyon", country: "France", flag: "🇫🇷" },
  { name: "Marseille", country: "France", flag: "🇫🇷" },
  { name: "Lille", country: "France", flag: "🇫🇷" },
  { name: "Toulouse", country: "France", flag: "🇫🇷" },
  { name: "Casablanca", country: "Maroc", flag: "🇲🇦" },
  { name: "Rabat", country: "Maroc", flag: "🇲🇦" },
  { name: "Fès", country: "Maroc", flag: "🇲🇦" },
  { name: "Marrakech", country: "Maroc", flag: "🇲🇦" },
  { name: "Tanger", country: "Maroc", flag: "🇲🇦" },
  { name: "Bordeaux", country: "France", flag: "🇫🇷" },
  { name: "Nice", country: "France", flag: "🇫🇷" },
  { name: "Nantes", country: "France", flag: "🇫🇷" },
  { name: "Strasbourg", country: "France", flag: "🇫🇷" },
  { name: "Montpellier", country: "France", flag: "🇫🇷" },
];

const CityAutocomplete = ({ label, placeholder, value, onChange, className }: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>(popularCities);
  const [dynamicCities, setDynamicCities] = useState<City[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadDestinationsFromDB();
  }, []);

  const loadDestinationsFromDB = async () => {
    try {
      const { data: destinations } = await supabase
        .from('destinations')
        .select('name, country')
        .eq('is_active', true);

      if (destinations) {
        const dbCities = destinations.map(dest => ({
          name: dest.name,
          country: dest.country || 'Maroc',
          flag: dest.country === 'France' ? '🇫🇷' : '🇲🇦'
        }));
        setDynamicCities(dbCities);
      }
    } catch (error) {
      console.error('Erreur chargement destinations:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Combine popular cities with database cities
    const allCities = [...popularCities, ...dynamicCities];
    // Remove duplicates based on name
    const uniqueCities = allCities.filter((city, index, self) => 
      index === self.findIndex(c => c.name.toLowerCase() === city.name.toLowerCase())
    );

    // Filter cities based on input - privilégier les villes qui commencent par la lettre tapée
    if (inputValue.length >= 1) {
      const searchTerm = inputValue.toLowerCase();
      
      // D'abord les villes qui commencent par la lettre tapée
      const startsWithSearch = uniqueCities.filter(city =>
        city.name.toLowerCase().startsWith(searchTerm)
      );
      
      // Puis les villes qui contiennent la lettre (mais ne commencent pas par elle)
      const containsSearch = uniqueCities.filter(city =>
        city.name.toLowerCase().includes(searchTerm) && 
        !city.name.toLowerCase().startsWith(searchTerm)
      );
      
      // Combiner les résultats : d'abord celles qui commencent, puis celles qui contiennent
      const filtered = [...startsWithSearch, ...containsSearch].slice(0, 8);
      
      
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  };

  const handleCitySelect = (city: City) => {
    // Capitaliser automatiquement le nom de la ville
    const capitalizedCityName = city.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const capitalizedCountry = city.country
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    onChange(`${capitalizedCityName}, ${capitalizedCountry}`);
    setIsOpen(false);
  };

  const handleFocus = () => {
    // Au focus, charger toutes les destinations disponibles si pas de texte
    if (!value || value.length === 0) {
      const allCities = [...popularCities, ...dynamicCities];
      const uniqueCities = allCities.filter((city, index, self) => 
        index === self.findIndex(c => c.name.toLowerCase() === city.name.toLowerCase())
      );
      setFilteredCities(uniqueCities.slice(0, 10)); // Montrer les 10 premières villes
      setIsOpen(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-10 h-12 border-0 bg-muted"
        />
        
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 bg-white border border-border rounded-lg shadow-lg z-[9999] max-h-64 overflow-y-auto mt-1"
          >
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Lieux populaires</span>
              </div>
            </div>
            <div className="py-2">
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <button
                    key={`${city.name}-${city.country}`}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">{city.flag}</span>
                    <div>
                      <div className="font-medium text-foreground">{city.name}</div>
                      <div className="text-sm text-muted-foreground">{city.country}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  Aucune ville trouvée
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityAutocomplete;