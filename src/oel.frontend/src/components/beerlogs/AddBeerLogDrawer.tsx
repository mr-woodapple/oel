import { useEffect, useState, type FormEvent } from "react";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
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
import { localDateTimeToOffset, toLocalDateTimeInput } from "@/lib/beerFormatting";
import {
  servingFormats,
  type BeerLog,
  type BeerLogLocation,
  type CreateBeerLogInput,
  type UpdateBeerLogInput,
} from "@/models/BeerLog";
import { PhotoInput } from "@/components/shared/PhotoInput";
import { LocationPicker } from "@/components/beerlogs/LocationPicker";

type AddBeerLogDrawerProps = {
  open: boolean;
  initialBeerId?: number;
  beerLog?: BeerLog;
  onOpenChange: (open: boolean) => void;
  onRequestAddBeer: () => void;
};

const formatOptions = [
  { value: servingFormats.Draft, label: "Fass" },
  { value: servingFormats.Can, label: "Dose" },
  { value: servingFormats.Bottle, label: "Flasche" },
  { value: servingFormats.Cask, label: "Cask" },
  { value: servingFormats.Other, label: "Anderes" },
];

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
  const [rating, setRating] = useState(beerLog ? String(beerLog.rating) : "4");
  const [format, setFormat] = useState(beerLog ? String(beerLog.format) : String(servingFormats.Draft));
  const [location, setLocation] = useState<BeerLogLocation | null>(beerLog?.location ?? null);
  const [dateLogged, setDateLogged] = useState(() => beerLog
    ? toLocalDateTimeInput(new Date(beerLog.dateLogged))
    : toLocalDateTimeInput());
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Opening starts a fresh create/edit session with the current source data.
    // oxlint-disable-next-line react/set-state-in-effect
    setSelectedBeerId(beerLog ? String(beerLog.beerId) : "");
    setRating(beerLog ? String(beerLog.rating) : "4");
    setFormat(beerLog ? String(beerLog.format) : String(servingFormats.Draft));
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
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection="down">
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
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <h2 className="m-0! text-xl! font-semibold text-foreground">Zuerst ein Bier anlegen</h2>
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
          </>
        ) : (
          <>
            <form
              id="beer-log-form"
              className="flex flex-1 flex-col gap-6 overflow-y-auto p-4"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-foreground" htmlFor="log-beer">Bier*</Label>
                <Select value={beerId} onValueChange={(value) => setSelectedBeerId(value ?? "")}>
                  <SelectTrigger id="log-beer" className="h-11 w-full rounded-xl text-base" disabled={beers.isPending}>
                    <SelectValue placeholder={beers.isPending ? "Biere werden geladen …" : "Bier auswählen"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {beers.data?.map((beer) => (
                      <SelectItem key={beer.id} value={String(beer.id)} className="text-sm">
                        {beer.name} · {beer.brewery}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-foreground" htmlFor="log-rating">Bewertung*</Label>
                  <Input
                    id="log-rating"
                    className="h-11 rounded-xl text-base"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="5"
                    step="0.5"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-foreground" htmlFor="log-format">Serviert als*</Label>
                  <Select value={format} onValueChange={(value) => setFormat(value ?? String(servingFormats.Draft))}>
                    <SelectTrigger id="log-format" className="h-11 w-full rounded-xl text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)} className="text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <LocationPicker value={location} onChange={setLocation} />

              <div className="grid gap-2">
                <Label className="text-sm font-medium text-foreground" htmlFor="log-date">Datum und Uhrzeit*</Label>
                <Input
                  id="log-date"
                  className="h-11 rounded-xl text-base"
                  type="datetime-local"
                  value={dateLogged}
                  onChange={(event) => setDateLogged(event.target.value)}
                  required
                />
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
            <DrawerFooter>
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
