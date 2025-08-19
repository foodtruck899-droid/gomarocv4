import { useState } from "react";
import { Users, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface PassengerSelectorProps {
  label: string;
  placeholder: string;
  value: { adults: number; children: number };
  onChange: (passengers: { adults: number; children: number }) => void;
}

export function PassengerSelector({ label, placeholder, value, onChange }: PassengerSelectorProps) {
  const [open, setOpen] = useState(false);

  const updatePassengers = (type: 'adults' | 'children', action: 'add' | 'subtract') => {
    const newValue = { ...value };
    if (action === 'add') {
      newValue[type] += 1;
    } else if (action === 'subtract' && newValue[type] > 0) {
      newValue[type] -= 1;
    }
    // Ensure at least 1 adult
    if (newValue.adults === 0) {
      newValue.adults = 1;
    }
    onChange(newValue);
  };

  const totalPassengers = value.adults + value.children;
  const displayText = totalPassengers === 1 
    ? "1 Adulte" 
    : `${totalPassengers} Passager${totalPassengers > 1 ? 's' : ''}`;

  return (
    <div className="relative">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 justify-start text-left font-normal border-0 bg-muted"
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Adultes</div>
                <div className="text-sm text-muted-foreground">12 ans et plus</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updatePassengers('adults', 'subtract')}
                  disabled={value.adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{value.adults}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updatePassengers('adults', 'add')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enfants</div>
                <div className="text-sm text-muted-foreground">2-11 ans</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updatePassengers('children', 'subtract')}
                  disabled={value.children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{value.children}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updatePassengers('children', 'add')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={() => setOpen(false)}
            >
              Confirmer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}