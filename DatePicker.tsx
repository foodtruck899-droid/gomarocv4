import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  label: string;
  placeholder: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
}

export function DatePicker({ label, placeholder, value, onChange, minDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 justify-start text-left font-normal border-0 bg-muted",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? format(value, "PPP", { locale: fr }) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 z-[9999] bg-popover border shadow-lg" 
          align="start" 
          side="bottom"
          sideOffset={8}
          avoidCollisions={true}
          collisionPadding={16}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={(date) => minDate ? date < minDate : false}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}