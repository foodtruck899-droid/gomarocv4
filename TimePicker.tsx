import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange: (time: string) => void;
}

export const TimePicker = ({ label, placeholder, value, onChange }: TimePickerProps) => {
  return (
    <div className="relative">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-12 pl-10 border-0 bg-muted",
            !value && "text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
};