import { useState, type FormEvent } from "react";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeading,
  DrawerTitle,
} from "@/components/shared/GenericDrawer";
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
    };

    try {
      await addBeerLog.mutateAsync(newBeerLog);
      setRating("4");
      setFormat(String(servingFormats.Draft));
      setLocation("");
      setDateLogged(toLocalDateTimeInput());
      handleOpenChange(false);
    } catch {
      // The mutation displays the user-facing error toast.
    }
  }

  const noBeers = beers.isSuccess && beers.data.length === 0;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeading className="border-b border-border/70">
          <DrawerTitle className="text-left text-xl font-semibold text-foreground">Bier-Log hinzufügen</DrawerTitle>
          <DrawerDescription className="mt-1 text-left text-sm text-muted-foreground">
            Halte fest, wann, wo und wie dir das Bier geschmeckt hat.
          </DrawerDescription>
        </DrawerHeading>

        {noBeers ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <h2 className="m-0! text-xl! font-semibold text-foreground">Zuerst ein Bier anlegen</h2>
            <p className="mt-2 max-w-sm text-base text-muted-foreground">
              Jeder Bier-Log gehört zu einem Bier in deiner Sammlung.
            </p>
            <Button className="mt-5 h-11 rounded-xl px-5 text-sm" onClick={onRequestAddBeer}>
              Bier hinzufügen
            </Button>
          </div>
        ) : (
          <form className="flex flex-col gap-6 px-5 pb-8 pt-5 text-left" onSubmit={handleSubmit}>
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

            <div className="sticky bottom-0 -mx-5 mt-1 flex gap-3 border-t bg-background/95 px-5 pt-4 backdrop-blur">
              <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl text-sm" onClick={() => handleOpenChange(false)}>
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="h-11 flex-1 rounded-xl text-sm"
                disabled={!beerId || addBeerLog.isPending || beers.isError}
              >
                {addBeerLog.isPending ? "Wird gespeichert …" : "Log speichern"}
              </Button>
            </div>
          </form>
        )}
      </DrawerContent>
    </Drawer>
  );
}
