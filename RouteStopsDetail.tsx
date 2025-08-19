import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RouteStopsDetailProps {
  routeId: string;
  className?: string;
}

export const RouteStopsDetail = ({ routeId, className }: RouteStopsDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStops = async () => {
    if (stops.length > 0) return; // Déjà chargé
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('route_stops_detailed')
        .select('*')
        .eq('route_id', routeId)
        .order('stop_order');

      if (error) throw error;
      setStops(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des escales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      loadStops();
    }
    setIsOpen(!isOpen);
  };

  if (stops.length <= 2) {
    // Pas d'escales (juste origine et destination)
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle} className={className}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleToggle}
        >
          <MapPin className="mr-1 h-3 w-3" />
          Voir les escales ({stops.length - 2})
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <Card className="border-l-4 border-l-primary/20">
          <CardContent className="p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Escales prévues
              </h4>
              
              {loading ? (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  Chargement des escales...
                </div>
              ) : (
                <div className="space-y-2">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' : 
                            index === stops.length - 1 ? 'bg-red-500' : 
                            'bg-blue-500'
                          }`} />
                          <span className="ml-2 font-medium">{stop.destination_name}</span>
                        </div>
                        
                        {(index === 0 || index === stops.length - 1) && (
                          <Badge variant="outline" className="text-xs">
                            {index === 0 ? 'Départ' : 'Arrivée'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        {stop.departure_time && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{stop.departure_time}</span>
                          </div>
                        )}
                        {stop.arrival_time && stop.arrival_time !== stop.departure_time && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>→ {stop.arrival_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};