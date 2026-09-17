import { useState, type FormEvent } from "react";
import { Crosshair, LoaderCircle, MapPin, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BeerLogLocation } from "@/models/BeerLog";
import FormField from "@/components/shared/form/FormField";

type LocationPickerProps = {
  value: BeerLogLocation | null;
  onChange: (location: BeerLogLocation | null) => void;
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [coordinateDrawerOpen, setCoordinateDrawerOpen] = useState(false);
  const [name, setName] = useState(value?.name ?? "");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  function openCoordinateDrawer() {
    setLatitude(value?.latitude === null || value?.latitude === undefined ? "" : String(value.latitude));
    setLongitude(value?.longitude === null || value?.longitude === undefined ? "" : String(value.longitude));
    setCoordinateDrawerOpen(true);
  }

  function useCurrentLocation() {
    setLocationError(null);

    if (!("geolocation" in navigator)) {
      setLocationError("Dein Browser unterstützt keine Standortabfrage.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          name: name ?? "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? "Der Standortzugriff wurde nicht erlaubt."
          : "Der aktuelle Standort konnte nicht ermittelt werden.";
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 },
    );
  }

  function saveCoordinates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) return;

    onChange({
      name: name.trim() || null,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    });
    setLocationError(null);
    setCoordinateDrawerOpen(false);
  }

  // FIXME: far from ideal, but name should be present for every location, not only custom coordinate inputs
  function saveLocationName(value: string) {
    setName(value)
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    onChange({
      name: name.trim() || null,
      latitude: parsedLatitude !== 0 ? parsedLatitude : null,
      longitude: parsedLongitude !== 0 ? parsedLongitude : null,
    });
  }

  function clearLocation() {
    setName("");
    onChange(null);
  }

  return (
    <>
      <div className="grid gap-2">
        <Label className="text-foreground">Ort</Label>
        <Label className="text-sm text-muted-foreground">Nutze deinen aktuellen Standort oder gib Koordinaten ein. Eine Bezeichnung ist optional.</Label>

        {value && (
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/35 p-3 text-left">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {value.name ?? "Gespeicherte Koordinaten"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {value.latitude !== null && value.longitude !== null
                  ? `${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)}`
                  : "Koordinaten nicht verfügbar"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Ort entfernen"
              onClick={() => clearLocation()}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}

        <div className="grid gap-2">
          <FormField label="Bezeichnung" htmlFor="location-name">
            <Input
              id="location-name"
              placeholder="z. B. Mikkeller Bar"
              value={name}
              onChange={(event) => saveLocationName(event.target.value)}
            />
          </FormField>

          <Button type="button" variant="secondary" onClick={useCurrentLocation} disabled={isLocating}>
            {isLocating ? <LoaderCircle className="animate-spin" /> : <Crosshair />}
            {isLocating ? "Standort wird ermittelt..." : "Aktuellen Standort verwenden"}
          </Button>
          <Button type="button" variant="outline" onClick={openCoordinateDrawer}>
            <Pencil /> Koordinaten eingeben
          </Button>
        </div>

        {locationError && (
          <p role="alert" className="text-sm text-destructive">{locationError}</p>
        )}
      </div>

      <Drawer open={coordinateDrawerOpen} onOpenChange={setCoordinateDrawerOpen} swipeDirection="down">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Koordinaten eingeben</DrawerTitle>
            <DrawerDescription>
              Gib Breiten- und Längengrad ein.
            </DrawerDescription>
          </DrawerHeader>
          <form
            id="beer-log-location-form"
            className="grid flex-1 gap-5 overflow-y-auto p-4"
            onSubmit={saveCoordinates}
          >
            <div className="grid gap-4">
              <FormField label="Breitengrad" htmlFor="location-latitude" required>
                <Input
                  id="location-latitude"
                  type="number"
                  inputMode="decimal"
                  min="-90"
                  max="90"
                  step="any"
                  placeholder="48.13715"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  required
                />
              </FormField>

              <FormField label="Längengrad" htmlFor="location-longitude" required>
                <Input
                  id="location-longitude"
                  type="number"
                  inputMode="decimal"
                  min="-180"
                  max="180"
                  step="any"
                  placeholder="11.57612"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  required
                />
              </FormField>
            </div>
          </form>
          <DrawerFooter>
            <Button type="submit" form="beer-log-location-form">Ort übernehmen</Button>
            <DrawerClose render={<Button type="button" variant="outline" />}>
              Abbrechen
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
