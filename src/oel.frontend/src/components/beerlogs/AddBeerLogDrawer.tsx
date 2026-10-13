import { Fragment, useEffect, useState, type FormEvent } from "react";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { servingFormats } from "@/data/servingFormats";
import { localDateTimeToOffset, toLocalDateTimeInput } from "@/lib/beerFormatting";
import type { BeerLog, BeerLogLocation, CreateBeerLogInput, UpdateBeerLogInput } from "@/models/BeerLog";
import { PhotoInput } from "@/components/shared/PhotoInput";
import { LocationPicker } from "@/components/beerlogs/LocationPicker";
import FormField from "@/components/shared/form/FormField";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

type AddBeerLogDrawerProps = {
  open: boolean;
  initialBeerId?: number;
  beerLog?: BeerLog;
  onOpenChange: (open: boolean) => void;
  onRequestAddBeer: () => void;
};

export function AddBeerLogDrawer({
  open,
  initialBeerId,
  beerLog,
  onOpenChange,
  onRequestAddBeer,
}: AddBeerLogDrawerProps) {
  const { beers } = useBeer();
  const { addBeerLog, updateBeerLog } = useBeerLogs();
  const [selectedBeerId, setSelectedBeerId] = useState(beerLog ? String(beerLog.beerId) : "");
  const [rating, setRating] = useState(beerLog ? String(beerLog.rating) : "");
  const [format, setFormat] = useState(beerLog ? String(beerLog.format) : "");
  const [location, setLocation] = useState<BeerLogLocation | null>(beerLog?.location ?? null);
  const [dateLogged, setDateLogged] = useState(() => beerLog
    ? toLocalDateTimeInput(new Date(beerLog.dateLogged))
    : toLocalDateTimeInput());
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Opening starts a fresh create/edit session with the current source data.
    setSelectedBeerId(beerLog ? String(beerLog.beerId) : "");
    setRating(beerLog ? String(beerLog.rating) : "");
    setFormat(beerLog ? String(beerLog.format) : "");
    setLocation(beerLog?.location ?? null);
    setDateLogged(beerLog
      ? toLocalDateTimeInput(new Date(beerLog.dateLogged))
      : toLocalDateTimeInput());
    setPhoto(null);
    setRemovePhoto(false);
  }, [beerLog, open]);

  const beerId = selectedBeerId || (initialBeerId ? String(initialBeerId) : "");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedBeerId("");
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const displayedOriginalDate = beerLog
      ? toLocalDateTimeInput(new Date(beerLog.dateLogged))
      : null;
    const beerLogInput: CreateBeerLogInput = {
      beerId: Number(beerId),
      rating: Number(rating),
      format: Number(format) as CreateBeerLogInput["format"],
      location,
      dateLogged: beerLog && dateLogged === displayedOriginalDate
        ? beerLog.dateLogged
        : localDateTimeToOffset(dateLogged),
      photo,
    };

    try {
      if (beerLog) {
        const update: UpdateBeerLogInput = {
          ...beerLogInput,
          id: beerLog.id,
          removePhoto,
        };
        await updateBeerLog.mutateAsync(update);
      } else {
        await addBeerLog.mutateAsync(beerLogInput);
      }
      handleOpenChange(false);
    } catch {
      // The mutation displays the user-facing error toast.
    }
  }

  const noBeers = beers.isSuccess && beers.data.length === 0;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection="down" showSwipeHandle>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{beerLog ? "Bier-Log bearbeiten" : "Bier-Log hinzufügen"}</DrawerTitle>
          <DrawerDescription>
            {beerLog
              ? "Passe die Angaben zu diesem Bier-Log an."
              : "Halte fest, wann, wo und wie dir das Bier geschmeckt hat."}
          </DrawerDescription>
        </DrawerHeader>

        {noBeers ? (
          // TODO: Replace with shadcn empty thing
          <Fragment>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <h2 className="m-0 text-xl font-semibold text-foreground">Zuerst ein Bier anlegen</h2>
                <p className="mt-2 max-w-sm text-base text-muted-foreground">
                  Jeder Bier-Log gehört zu einem Bier in deiner Sammlung.
                </p>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={onRequestAddBeer}>
                Bier hinzufügen
              </Button>
            </DrawerFooter>
          </Fragment>
        ) : (
          <>
            <form
              id="beer-log-form"
              className="flex flex-1 flex-col gap-6 overflow-y-auto p-4"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-4">
                <FormField label="Bier" htmlFor="log-beer" required >
                  <Combobox
                    items={beers.data ?? []}
                    itemToStringLabel={(beer) => beer?.name ?? ""}
                    value={beers.data?.find((b) => String(b.id) === beerId) ?? null}
                    onValueChange={(beer) => setSelectedBeerId(beer ? String(beer.id) : "")}
                    isItemEqualToValue={(item, val) => item?.id === val?.id}
                    autoHighlight
                  >
                    <ComboboxInput id="log-beer" placeholder="Bier auswählen" />
                    <ComboboxContent>
                      <ComboboxEmpty>Keine Biere gefunden.</ComboboxEmpty>
                      <ComboboxList>
                        {(beer) => (
                          <ComboboxItem key={beer.id} value={beer}>
                            {beer.name} ({beer.brewery})
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid">
                  <FormField label="Bewertung" htmlFor="log-rating" required>
                    <Input
                      id="log-rating"
                      type="number"
                      inputMode="decimal"
                      placeholder="1-4 oder gar 5?"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                      required
                    />
                  </FormField>
                </div>
                <div className="grid gap-2">
                  <FormField label="Serviert als" htmlFor="log-format" required>
                    <Select
                      items={servingFormats.map((option) => ({ value: String(option.value), label: option.label }))}
                      value={format}
                      onValueChange={(value) => setFormat(value ?? "")}
                      required
                    >
                      <SelectTrigger id="log-format" className="w-full">
                        <SelectValue placeholder="Serviert als?" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {servingFormats.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </div>

              <LocationPicker value={location} onChange={setLocation} />

              <div className="grid gap-2">
                <FormField label="Datum und Uhrzeit" htmlFor="log-date" required>
                  <Input
                    id="log-date"
                    type="datetime-local"
                    value={dateLogged}
                    onChange={(event) => setDateLogged(event.target.value)}
                    required
                  />
                </FormField>
              </div>

              <PhotoInput
                id="beer-log-photo"
                photo={photo}
                onChange={setPhoto}
                existingPhotoUrl={beerLog?.photoUrl}
                existingPhotoRemoved={removePhoto}
                onExistingPhotoRemovedChange={setRemovePhoto}
              />
            </form>
            <DrawerFooter className="mt-5">
              <Button
                type="submit"
                form="beer-log-form"
                disabled={!beerId || addBeerLog.isPending || updateBeerLog.isPending || beers.isError}
              >
                {addBeerLog.isPending || updateBeerLog.isPending
                  ? "Wird gespeichert …"
                  : beerLog ? "Änderungen speichern" : "Log speichern"}
              </Button>
              <DrawerClose render={<Button type="button" variant="outline" />}>
                Abbrechen
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
