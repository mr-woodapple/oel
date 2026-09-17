import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { useBeer } from "@/api/hooks/useBeer";
import { countryOptions } from "@/api/queries/countryQueries";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhotoInput } from "@/components/shared/PhotoInput";
import FormField from "@/components/shared/form/FormField";
import { beerStyles } from "@/data/beerStyles";
import type { Beer, CreateBeerInput, UpdateBeerInput } from "@/models/Beer";

type AddBeerDrawerProps = {
  open: boolean;
  beer?: Beer;
  onOpenChange: (open: boolean) => void;
};

const initialForm = {
  name: "",
  brewery: "",
  countryCode: "",
  style: "",
  abv: "",
  ibu: "",
  appearance: "",
  tastingNotes: "",
  generalNotes: "",
};

function formFromBeer(beer: Beer) {
  return {
    name: beer.name,
    brewery: beer.brewery,
    countryCode: beer.countryCode ?? "",
    style: beer.style,
    abv: beer.abv === null ? "" : String(beer.abv),
    ibu: beer.ibu === null ? "" : String(beer.ibu),
    appearance: beer.appearance ?? "",
    tastingNotes: beer.tastingNotes ?? "",
    generalNotes: beer.generalNotes ?? "",
  };
}

export function AddBeerDrawer({ open, beer, onOpenChange }: AddBeerDrawerProps) {
  const { addBeer, updateBeer } = useBeer();
  const countries = useQuery({ ...countryOptions, enabled: open });
  const countryItems = [{ value: "", label: "Keine Angabe" }, ...(countries.data ?? [])];
  const [form, setForm] = useState(() => beer ? formFromBeer(beer) : initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Opening starts a fresh create/edit session with the current source data.
    // oxlint-disable-next-line react/set-state-in-effect
    setForm(beer ? formFromBeer(beer) : initialForm);
    setPhoto(null);
    setRemovePhoto(false);
  }, [beer, open]);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const beerInput: CreateBeerInput = {
      name: form.name.trim(),
      brewery: form.brewery.trim(),
      countryCode: form.countryCode || null,
      style: form.style.trim(),
      abv: form.abv === "" ? null : Number(form.abv),
      ibu: form.ibu === "" ? null : Number(form.ibu),
      appearance: form.appearance.trim() || null,
      tastingNotes: form.tastingNotes.trim() || null,
      generalNotes: form.generalNotes.trim() || null,
      photo,
    };

    try {
      if (beer) {
        const update: UpdateBeerInput = {
          ...beerInput,
          id: beer.id,
          removePhoto,
        };
        await updateBeer.mutateAsync(update);
      } else {
        await addBeer.mutateAsync(beerInput);
      }
      onOpenChange(false);
    } catch {
      // The mutation displays the user-facing error toast.
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="down" showSwipeHandle>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{beer ? "Bier bearbeiten" : "Bier hinzufügen"}</DrawerTitle>
          <DrawerDescription>
            {beer
              ? "Passe die Stammdaten und deine Eindrücke an."
              : "Lege die Stammdaten und deine ersten Eindrücke fest."}
          </DrawerDescription>
        </DrawerHeader>

        <form
          id="beer-form"
          className="flex flex-1 flex-col gap-6 overflow-y-auto p-4"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4">
            <FormField label="Name" htmlFor="beer-name" required>
              <Input
                id="beer-name"
                placeholder="Name des Biers..."
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="off"
                required
              />
            </FormField>
            <FormField label="Brauerei" htmlFor="beer-brewery" required>
              <Input
                id="beer-brewery"
                placeholder="Name der Brauerei..."
                value={form.brewery}
                onChange={(event) => updateField("brewery", event.target.value)}
                required
              />
            </FormField>
          </div>

          <FormField label="Herkunftsland" htmlFor="beer-country">
            <Select
              items={countryItems}
              value={form.countryCode}
              onValueChange={(value) => updateField("countryCode", value ?? "")}
              disabled={!countries.data?.length}
            >
              <SelectTrigger id="beer-country" className="w-full">
                <SelectValue placeholder="Land auswählen" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {countryItems.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {countries.isPending && <p className="text-sm text-muted-foreground">Länder werden geladen …</p>}
            {countries.isError && (
              <div role="alert" className="text-sm text-destructive">
                Länder konnten nicht geladen werden.
                <Button type="button" variant="link" onClick={() => countries.refetch()}>
                  Erneut versuchen
                </Button>
              </div>
            )}
            {countries.isSuccess && countries.data.length === 0 && (
              <p className="text-sm text-muted-foreground">Keine Länder verfügbar.</p>
            )}
          </FormField>

          <FormField label="Stil" htmlFor="beer-style" required>
            <Select value={form.style} onValueChange={(value) => updateField("style", value ?? "")}>
              <SelectTrigger id="beer-style" className="w-full">
                <SelectValue placeholder="Bierstil auswählen" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {beerStyles.map((beerStyle) => (
                  <SelectItem key={beerStyle} value={beerStyle}>
                    {beerStyle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Alkoholgehalt (%)" htmlFor="beer-abv">
              <Input
                id="beer-abv"
                type="number"
                inputMode="decimal"
                placeholder="5,5"
                min="0"
                max="100"
                step="0.1"
                value={form.abv}
                onChange={(event) => updateField("abv", event.target.value)}
              />
            </FormField>
            <FormField label="Bitterkeit (IBU)" htmlFor="beer-ibu">
              <Input
                id="beer-ibu"
                type="number"
                inputMode="numeric"
                placeholder="20"
                min="0"
                step="1"
                value={form.ibu}
                onChange={(event) => updateField("ibu", event.target.value)}
              />
            </FormField>
          </div>

          <PhotoInput
            id="beer-photo"
            photo={photo}
            onChange={setPhoto}
            existingPhotoUrl={beer?.photoUrl}
            existingPhotoRemoved={removePhoto}
            onExistingPhotoRemovedChange={setRemovePhoto}
          />

          <FormField label="Aussehen" htmlFor="beer-appearance">
            <Textarea
              id="beer-appearance"
              className="min-h-24 rounded-lg text-base"
              placeholder="Farbe, Schaum, Klarheit …"
              value={form.appearance}
              onChange={(event) => updateField("appearance", event.target.value)}
            />
          </FormField>
          <FormField label="Geschmacksnotizen" htmlFor="beer-tasting-notes">
            <Textarea
              id="beer-tasting-notes"
              className="min-h-24 rounded-lg text-base"
              placeholder="Aromen, Mundgefühl, Abgang …"
              value={form.tastingNotes}
              onChange={(event) => updateField("tastingNotes", event.target.value)}
            />
          </FormField>
          <FormField label="Allgemeine Notizen" htmlFor="beer-general-notes">
            <Textarea
              id="beer-general-notes"
              className="min-h-24 rounded-lg text-base"
              value={form.generalNotes}
              onChange={(event) => updateField("generalNotes", event.target.value)}
            />
          </FormField>
        </form>

        <DrawerFooter className="mt-5">
          <Button
            type="submit"
            form="beer-form"
            disabled={!form.style || addBeer.isPending || updateBeer.isPending}
          >
            {addBeer.isPending || updateBeer.isPending
              ? "Wird gespeichert …"
              : beer ? "Änderungen speichern" : "Bier speichern"}
          </Button>
          <DrawerClose render={<Button type="button" variant="outline" />}>
            Abbrechen
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
