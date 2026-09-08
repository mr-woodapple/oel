import { useEffect, useState, type FormEvent } from "react";

import { useBeer } from "@/api/hooks/useBeer";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhotoInput } from "@/components/shared/PhotoInput";
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
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="down">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" htmlFor="beer-name" required>
              <Input
                id="beer-name"
                className="h-11 rounded-xl text-base"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="off"
                required
              />
            </FormField>
            <FormField label="Brauerei" htmlFor="beer-brewery" required>
              <Input
                id="beer-brewery"
                className="h-11 rounded-xl text-base"
                value={form.brewery}
                onChange={(event) => updateField("brewery", event.target.value)}
                required
              />
            </FormField>
          </div>

          <FormField label="Stil" htmlFor="beer-style" required>
            <Select value={form.style} onValueChange={(value) => updateField("style", value ?? "")}>
              <SelectTrigger id="beer-style" className="h-11 w-full rounded-xl text-base">
                <SelectValue placeholder="Bierstil auswählen" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {beerStyles.map((beerStyle) => (
                  <SelectItem key={beerStyle} value={beerStyle} className="text-sm">
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
                className="h-11 rounded-xl text-base"
                type="number"
                inputMode="decimal"
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
                className="h-11 rounded-xl text-base"
                type="number"
                inputMode="numeric"
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
              className="min-h-24 rounded-xl text-base"
              placeholder="Farbe, Schaum, Klarheit …"
              value={form.appearance}
              onChange={(event) => updateField("appearance", event.target.value)}
            />
          </FormField>
          <FormField label="Geschmacksnotizen" htmlFor="beer-tasting-notes">
            <Textarea
              id="beer-tasting-notes"
              className="min-h-24 rounded-xl text-base"
              placeholder="Aromen, Mundgefühl, Abgang …"
              value={form.tastingNotes}
              onChange={(event) => updateField("tastingNotes", event.target.value)}
            />
          </FormField>
          <FormField label="Allgemeine Notizen" htmlFor="beer-general-notes">
            <Textarea
              id="beer-general-notes"
              className="min-h-24 rounded-xl text-base"
              value={form.generalNotes}
              onChange={(event) => updateField("generalNotes", event.target.value)}
            />
          </FormField>
        </form>

        <DrawerFooter>
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

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
