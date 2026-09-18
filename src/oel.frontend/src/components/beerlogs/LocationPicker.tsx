import { useState } from "react";
import { MapPin } from "lucide-react";

import { LocationEditor } from "@/components/beerlogs/LocationEditor";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { formatLocation } from "@/lib/beerFormatting";
import type { BeerLogLocation } from "@/models/BeerLog";

type LocationPickerProps = {
  value: BeerLogLocation | null;
  onChange: (location: BeerLogLocation | null) => void;
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setEditing(true);
    setOpen(nextOpen);
  }

  function applyLocation(location: BeerLogLocation | null) {
    onChange(location);
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} onOpenChangeComplete={(nextOpen) => {
      if (!nextOpen) setEditing(false);
    }} swipeDirection="down" showSwipeHandle>
      <div className="grid gap-2">
        <Label htmlFor="choose-log-location">Ort</Label>
        <DrawerTrigger 
          render={
            <Button id="choose-log-location" type="button" variant="secondary" className="h-auto min-h-12 justify-start whitespace-normal py-3 text-left" />
          }>
          <MapPin className="shrink-0" />
          <span className="min-w-0 flex-1 wrap-break-word">{value ? formatLocation(value) : "Ort auswählen"}</span>
          {value && <span className="shrink-0 text-xs text-muted-foreground">Ändern</span>}
        </DrawerTrigger>
      </div>
      <DrawerContent className="mx-auto max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Ort auswählen</DrawerTitle>
          <DrawerDescription>Finde einen Ort in deiner Nähe oder gib Koordinaten ein.</DrawerDescription>
        </DrawerHeader>
        {editing && <LocationEditor value={value} onApply={applyLocation} active={open} />}
      </DrawerContent>
    </Drawer>
  );
}
