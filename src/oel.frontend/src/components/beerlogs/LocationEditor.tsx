import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Crosshair, LoaderCircle, MapPin, Pencil, Trash2 } from "lucide-react";

import { useNearbyLocations } from "@/api/hooks/useLocations";
import FormField from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import type { BeerLogLocation } from "@/models/BeerLog";
import type { Coordinates, LocationSuggestion } from "@/models/LocationSuggestion";

type LocationEditorProps = {
  value: BeerLogLocation | null;
  onApply: (location: BeerLogLocation | null) => void;
  active: boolean;
};

export function LocationEditor({ value, onApply, active }: LocationEditorProps) {
  const formId = useId();
  const [mode, setMode] = useState<"nearby" | "manual">(value ? "manual" : "nearby");
  const [name, setName] = useState(value?.name ?? "");
  const [latitude, setLatitude] = useState(value?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(value?.longitude?.toString() ?? "");
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const locationRequest = useRef(0);
  const nearby = useNearbyLocations(active && mode === "nearby" ? position : null);

  useEffect(() => () => { locationRequest.current += 1; }, [active]);

  const parsedLatitude = latitude.trim() === "" ? NaN : Number(latitude);
  const parsedLongitude = longitude.trim() === "" ? NaN : Number(longitude);
  const validCoordinates = Number.isFinite(parsedLatitude) && parsedLatitude >= -90 && parsedLatitude <= 90
    && Number.isFinite(parsedLongitude) && parsedLongitude >= -180 && parsedLongitude <= 180;

  function updateCoordinates(coordinates: Coordinates) {
    setLatitude(String(coordinates.latitude));
    setLongitude(String(coordinates.longitude));
  }

  function useCurrentLocation() {
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationError("Dein Browser unterstützt keine Standortabfrage. Du kannst Koordinaten manuell eingeben.");
      return;
    }
    const request = ++locationRequest.current;
    setIsLocating(true);
    setPosition(null);
    navigator.geolocation.getCurrentPosition((result) => {
      if (request !== locationRequest.current) return;
      const coordinates = { latitude: result.coords.latitude, longitude: result.coords.longitude };
      setPosition(coordinates);
      updateCoordinates(coordinates);
      setName("");
      setIsLocating(false);
    }, (error) => {
      if (request !== locationRequest.current) return;
      setIsLocating(false);
      setLocationError(error.code === error.PERMISSION_DENIED
        ? "Standortzugriff wurde nicht erlaubt. Du kannst Koordinaten manuell eingeben."
        : "Der Standort konnte nicht ermittelt werden. Versuche es erneut oder gib Koordinaten ein.");
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 });
  }

  function changeMode(nextMode: typeof mode) {
    locationRequest.current += 1;
    setIsLocating(false);
    setLocationError(null);
    setMode(nextMode);
  }

  function selectPlace(place: LocationSuggestion) {
    setName(place.name);
    updateCoordinates(place);
  }

  function saveLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!validCoordinates) return;
    onApply({ name: name.trim() || null, latitude: parsedLatitude, longitude: parsedLongitude });
  }

  return (
    <>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div role="group" aria-label="Ort auswählen über" className="grid grid-cols-2 gap-2">
          <Button type="button" variant={mode === "nearby" ? "secondary" : "outline"} aria-pressed={mode === "nearby"} onClick={() => changeMode("nearby")} className="h-auto flex-col gap-1 px-1 py-3 text-xs sm:flex-row sm:text-sm"><Crosshair /> In der Nähe</Button>
          <Button type="button" variant={mode === "manual" ? "secondary" : "outline"} aria-pressed={mode === "manual"} onClick={() => changeMode("manual")} className="h-auto flex-col gap-1 px-1 py-3 text-xs sm:flex-row sm:text-sm"><Pencil /> Manuell</Button>
        </div>

        {mode === "nearby" && (
          <section className="grid gap-3" aria-label="Orte in deiner Nähe">
            <Button type="button" variant="secondary" onClick={useCurrentLocation} disabled={isLocating}>
              {isLocating ? <LoaderCircle className="animate-spin" /> : <Crosshair />}
              {isLocating ? "Standort wird ermittelt …" : "Aktuellen Standort verwenden"}
            </Button>
            {locationError && <p role="alert" className="text-sm text-destructive">{locationError}</p>}
            {!position && !isLocating && !locationError && <p className="text-sm text-muted-foreground">Mit deiner Erlaubnis suchen wir im Umkreis von 1 km nach Orten.</p>}
            {position && (
              <PlaceResults places={nearby.data} loading={nearby.isFetching} error={nearby.isError} onRetry={() => void nearby.refetch()} onSelect={selectPlace} selected={{ name, latitude: parsedLatitude, longitude: parsedLongitude }} emptyMessage="Keine Orte in der Nähe gefunden. Du kannst die Koordinaten trotzdem übernehmen und selbst benennen." />
            )}
          </section>
        )}

        {mode !== "manual" && (
          <p className="text-xs text-muted-foreground">
            Powered by <a className="underline underline-offset-2" href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>
            {" · "}<a className="underline underline-offset-2" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
          </p>
        )}

        <form id={formId} onSubmit={saveLocation} className="grid gap-4 border-t pt-4">
          <p className="text-sm font-medium">{mode === "manual" ? "Koordinaten eingeben" : "Ausgewählter Standort"}</p>
          <FormField label="Bezeichnung (optional)" htmlFor={`${formId}-name`}>
            <Input id={`${formId}-name`} placeholder="z. B. Bei Freunden" value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Breitengrad" htmlFor={`${formId}-latitude`} required>
              <Input id={`${formId}-latitude`} type="number" inputMode="decimal" min="-90" max="90" step="any" placeholder="48.13715" value={latitude} onChange={(event) => setLatitude(event.target.value)} required />
            </FormField>
            <FormField label="Längengrad" htmlFor={`${formId}-longitude`} required>
              <Input id={`${formId}-longitude`} type="number" inputMode="decimal" min="-180" max="180" step="any" placeholder="11.57612" value={longitude} onChange={(event) => setLongitude(event.target.value)} required />
            </FormField>
          </div>
          <p className="text-xs text-muted-foreground">Die Bezeichnung kannst du frei ändern. Ohne Bezeichnung werden nur die Koordinaten gespeichert.</p>
        </form>
      </div>
      <DrawerFooter>
        <Button type="submit" form={formId} disabled={!validCoordinates || isLocating}>Ort übernehmen</Button>
        {value && <Button type="button" variant="ghost" onClick={() => onApply(null)}><Trash2 /> Ort entfernen</Button>}
        <DrawerClose render={<Button type="button" variant="outline" />}>Abbrechen</DrawerClose>
      </DrawerFooter>
    </>
  );
}

type PlaceResultsProps = {
  places: LocationSuggestion[] | undefined;
  loading: boolean;
  error: boolean;
  emptyMessage: string;
  selected: Coordinates & { name: string };
  onRetry: () => void;
  onSelect: (place: LocationSuggestion) => void;
};

function PlaceResults({ places, loading, error, emptyMessage, selected, onRetry, onSelect }: PlaceResultsProps) {
  if (loading) return <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Orte werden geladen …</p>;
  if (error) return (
    <div role="alert" className="grid gap-2">
      <p className="text-sm text-destructive">Die Ortssuche ist gerade nicht verfügbar. Du kannst weiterhin Koordinaten und eine Bezeichnung verwenden.</p>
      <Button type="button" variant="outline" onClick={onRetry}>Erneut versuchen</Button>
    </div>
  );
  if (!places) return null;
  if (places.length === 0) return <p role="status" className="text-sm text-muted-foreground">{emptyMessage}</p>;

  return (
    <div className="grid gap-2">
      <p role="status" className="text-xs text-muted-foreground">{places.length} Vorschläge · Wähle den passenden Ort aus.</p>
      <ul className="max-h-56 space-y-2 overflow-y-auto rounded-lg" aria-label="Ortsvorschläge">
        {places.map((place) => {
          const isSelected = selected.name === place.name && selected.latitude === place.latitude && selected.longitude === place.longitude;
          return (
            <li key={place.id}>
              <Button type="button" variant={isSelected ? "secondary" : "outline"} aria-pressed={isSelected} className="h-auto w-full justify-start gap-3 whitespace-normal p-3 text-left" onClick={() => onSelect(place)}>
                <MapPin className="shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block break-words font-medium">{place.name}</span>
                  <span className="block break-words text-xs font-normal text-muted-foreground">{place.address}</span>
                </span>
                {place.distance !== null && <span className="shrink-0 text-xs text-muted-foreground">{Math.round(place.distance)} m</span>}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
