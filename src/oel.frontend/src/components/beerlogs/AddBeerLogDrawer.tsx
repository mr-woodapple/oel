import { useState, type FormEvent } from "react";

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
import { servingFormats, type CreateBeerLogInput } from "@/models/BeerLog";
import { PhotoInput } from "@/components/shared/PhotoInput";

type AddBeerLogDrawerProps = {
  open: boolean;
  initialBeerId?: number;
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
  onOpenChange,
  onRequestAddBeer,
}: AddBeerLogDrawerProps) {
  const { beers } = useBeer();
  const { addBeerLog } = useBeerLogs();
  const [selectedBeerId, setSelectedBeerId] = useState("");
  const [rating, setRating] = useState("4");
  const [format, setFormat] = useState(String(servingFormats.Draft));
  const [location, setLocation] = useState("");
  const [dateLogged, setDateLogged] = useState(toLocalDateTimeInput);
  const [photo, setPhoto] = useState<File | null>(null);

  const beerId = selectedBeerId || (initialBeerId ? String(initialBeerId) : "");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedBeerId("");
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newBeerLog: CreateBeerLogInput = {
      beerId: Number(beerId),
      rating: Number(rating),
      format: Number(format) as CreateBeerLogInput["format"],
      location: location.trim() || null,
      dateLogged: localDateTimeToOffset(dateLogged),
      photo,
    };

    try {
      await addBeerLog.mutateAsync(newBeerLog);
      setRating("4");
      setFormat(String(servingFormats.Draft));
      setLocation("");
      setDateLogged(toLocalDateTimeInput());
      setPhoto(null);
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
          <DrawerTitle>Bier-Log hinzufügen</DrawerTitle>
          <DrawerDescription>
            Halte fest, wann, wo und wie dir das Bier geschmeckt hat.
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
              id="add-beer-log-form"
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

              <div className="grid gap-2">
                <Label className="text-sm font-medium text-foreground" htmlFor="log-location">Ort</Label>
                <Input
                  id="log-location"
                  className="h-11 rounded-xl text-base"
                  placeholder="z. B. Mikkeller Bar"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </div>

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

              <PhotoInput id="beer-log-photo" photo={photo} onChange={setPhoto} />
            </form>
            <DrawerFooter>
              <Button
                type="submit"
                form="add-beer-log-form"
                disabled={!beerId || addBeerLog.isPending || beers.isError}
              >
                {addBeerLog.isPending ? "Wird gespeichert …" : "Log speichern"}
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
