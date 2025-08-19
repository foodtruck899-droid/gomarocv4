import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchResults } from "@/components/SearchResults";
import { useSearch } from "@/hooks/useSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const { searchTrips, isSearching, searchResults } = useSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const fromCity = searchParams.get("from") || "";
  const toCity = searchParams.get("to") || "";
  const departureDate = searchParams.get("date");
  const departureTime = searchParams.get("time");
  const adults = parseInt(searchParams.get("adults") || "1");
  const children = parseInt(searchParams.get("children") || "0");
  const tripType = searchParams.get("tripType") || "one-way";

  useEffect(() => {
    if (fromCity && toCity && !hasSearched) {
      const searchDate = departureDate ? new Date(departureDate) : undefined;
      
      // Si une heure est spécifiée, l'ajouter à la date
      if (searchDate && departureTime) {
        const [hours, minutes] = departureTime.split(':');
        searchDate.setHours(parseInt(hours), parseInt(minutes));
      }

      searchTrips({
        fromCity,
        toCity,
        departureDate: searchDate,
        passengers: { adults, children },
        tripType: tripType as "one-way" | "round-trip"
      });
      
      setHasSearched(true);
    }
  }, [fromCity, toCity, departureDate, departureTime, adults, children, tripType, searchTrips, hasSearched]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* En-tête de recherche */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nouvelle recherche
              </Button>
            </Link>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Résultats de recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div><strong>Départ:</strong> {fromCity}</div>
                  <div><strong>Arrivée:</strong> {toCity}</div>
                  {departureDate && (
                    <div>
                      <strong>Date:</strong> {new Date(departureDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {departureTime && (
                    <div><strong>Heure:</strong> {departureTime}</div>
                  )}
                  <div>
                    <strong>Passagers:</strong> {adults} adulte{adults > 1 ? 's' : ''}
                    {children > 0 && `, ${children} enfant${children > 1 ? 's' : ''}`}
                  </div>
                  <div><strong>Type:</strong> {tripType === "one-way" ? "Aller simple" : "Aller-retour"}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résultats */}
          <SearchResults trips={searchResults} isLoading={isSearching} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;