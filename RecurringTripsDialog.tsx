import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface RecurringTripsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  routes: any[];
  buses: any[];
  onSubmit: (formData: FormData) => void;
}

export const RecurringTripsDialog: React.FC<RecurringTripsDialogProps> = ({
  isOpen,
  onOpenChange,
  routes,
  buses,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Voyages récurrents
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer des voyages récurrents</DialogTitle>
          <DialogDescription>
            Programmez automatiquement des voyages qui se répètent selon un planning défini
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recurring-route">Route</Label>
              <Select name="recurring-route" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recurring-bus">Bus</Label>
              <Select name="recurring-bus" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bus" />
                </SelectTrigger>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.plate_number} - {bus.capacity} places
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recurring-departure-time">Heure de départ</Label>
              <Input
                id="recurring-departure-time"
                name="recurring-departure-time"
                type="time"
                required
              />
            </div>

            <div>
              <Label htmlFor="recurring-arrival-time">Heure d'arrivée</Label>
              <Input
                id="recurring-arrival-time"
                name="recurring-arrival-time"
                type="time"
                required
              />
            </div>

            <div>
              <Label htmlFor="recurring-price">Prix (€)</Label>
              <Input
                id="recurring-price"
                name="recurring-price"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="recurring-seats">Places disponibles</Label>
              <Input
                id="recurring-seats"
                name="recurring-seats"
                type="number"
                min="1"
                max="50"
                required
              />
            </div>

            <div>
              <Label htmlFor="recurring-frequency">Fréquence</Label>
              <Select name="recurring-frequency" required>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Tous les jours</SelectItem>
                  <SelectItem value="weekly">Toutes les semaines</SelectItem>
                  <SelectItem value="monday">Tous les lundis</SelectItem>
                  <SelectItem value="tuesday">Tous les mardis</SelectItem>
                  <SelectItem value="wednesday">Tous les mercredis</SelectItem>
                  <SelectItem value="thursday">Tous les jeudis</SelectItem>
                  <SelectItem value="friday">Tous les vendredis</SelectItem>
                  <SelectItem value="saturday">Tous les samedis</SelectItem>
                  <SelectItem value="sunday">Tous les dimanches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recurring-weeks">Nombre de semaines</Label>
              <Input
                id="recurring-weeks"
                name="recurring-weeks"
                type="number"
                min="1"
                max="52"
                defaultValue="4"
                required
              />
            </div>

            <div>
              <Label htmlFor="recurring-start-date">Date de début</Label>
              <Input
                id="recurring-start-date"
                name="recurring-start-date"
                type="date"
                required
              />
            </div>

            <div>
              <Label htmlFor="recurring-notes">Notes spéciales</Label>
              <Input
                id="recurring-notes"
                name="recurring-notes"
                placeholder="Instructions particulières..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer les voyages récurrents
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};