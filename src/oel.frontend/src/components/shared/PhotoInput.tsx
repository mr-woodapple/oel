import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const maxPhotoSize = 10 * 1024 * 1024;
const acceptedPhotoTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
]);

type PhotoInputProps = {
  id: string;
  photo: File | null;
  onChange: (photo: File | null) => void;
};

export function PhotoInput({ id, photo, onChange }: PhotoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!photo && inputRef.current) inputRef.current.value = "";
  }, [photo]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedPhoto = event.target.files?.[0] ?? null;
    setError(null);

    if (selectedPhoto && !acceptedPhotoTypes.has(selectedPhoto.type)) {
      setError("Bitte wähle ein JPEG-, PNG-, WebP-, GIF-, AVIF-, HEIC- oder HEIF-Bild aus.");
      event.target.value = "";
      return;
    }

    if (selectedPhoto && selectedPhoto.size > maxPhotoSize) {
      setError("Das Foto darf höchstens 10 MB groß sein.");
      event.target.value = "";
      return;
    }

    setPreviewUrl(selectedPhoto ? URL.createObjectURL(selectedPhoto) : null);
    onChange(selectedPhoto);
  }

  function removePhoto() {
    setError(null);
    setPreviewUrl(null);
    onChange(null);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">Foto</Label>
      {photo && previewUrl && (
        <div className="relative overflow-hidden rounded-2xl border bg-muted">
          <img
            src={previewUrl}
            alt="Vorschau des ausgewählten Fotos"
            className="aspect-[4/3] max-h-72 w-full object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-3 top-3 rounded-full"
            onClick={removePhoto}
            aria-label="Foto entfernen"
          >
            <X />
          </Button>
        </div>
      )}
      <div className="relative">
        <ImagePlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
          className="h-11 rounded-xl pl-10 text-base file:mr-3"
          onChange={handleChange}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          aria-invalid={Boolean(error)}
        />
      </div>
      <p id={`${id}-help`} className="text-xs text-muted-foreground">
        Optional · maximal 10 MB
      </p>
      {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
