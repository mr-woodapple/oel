import { useState, type FormEvent } from "react";
import { Crosshair, LoaderCircle, MapPin, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BeerLogLocation } from "@/models/BeerLog";

type LocationPickerProps = {
  value: BeerLogLocation | null;
  onChange: (location: BeerLogLocation | null) => void;
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [coordinateDrawerOpen, setCoordinateDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  function openCoordinateDrawer() {
    setName(value?.name ?? "");
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
          name: null,
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

  return (
    <>
      <div className="grid gap-3">
        <Label className="text-sm font-medium text-foreground">Ort</Label>

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
              onClick={() => onChange(null)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={useCurrentLocation} disabled={isLocating}>
            {isLocating ? <LoaderCircle className="animate-spin" /> : <Crosshair />}
            {isLocating ? "Standort wird ermittelt …" : "Aktuellen Standort verwenden"}
          </Button>
          <Button type="button" variant="outline" onClick={openCoordinateDrawer}>
            <Pencil />
            {value ? "Anderen Ort eingeben" : "Koordinaten eingeben"}
          </Button>
        </div>

        {locationError && (
          <p role="alert" className="text-sm text-destructive">{locationError}</p>
        )}
      </div>

      <Drawer open={coordinateDrawerOpen} onOpenChange={setCoordinateDrawerOpen} swipeDirection="down">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Anderen Ort eingeben</DrawerTitle>
            <DrawerDescription>
              Gib Breiten- und Längengrad ein. Eine Bezeichnung ist optional.
            </DrawerDescription>
          </DrawerHeader>
          <form
            id="beer-log-location-form"
            className="grid flex-1 gap-5 overflow-y-auto p-4"
            onSubmit={saveCoordinates}
          >
            <div className="grid gap-2">
              <Label htmlFor="location-name">Bezeichnung</Label>
              <Input
                id="location-name"
                className="h-11 rounded-xl text-base"
                placeholder="z. B. Mikkeller Bar"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="location-latitude">Breitengrad*</Label>
                <Input
                  id="location-latitude"
                  className="h-11 rounded-xl text-base"
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location-longitude">Längengrad*</Label>
                <Input
                  id="location-longitude"
                  className="h-11 rounded-xl text-base"
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
              </div>
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
