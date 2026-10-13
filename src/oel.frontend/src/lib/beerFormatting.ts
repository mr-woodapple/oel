import { servingFormats, type ServingFormat } from "@/data/servingFormats";
import type { BeerLogLocation } from "@/models/BeerLog";

export function formatLocation(location: BeerLogLocation | null) {
  if (!location) return "Nicht angegeben";
  if (location.name) return location.name;

  if (location.latitude !== null && location.longitude !== null) {
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }

  return "Koordinaten nicht verfügbar";
}

export function formatServingFormat(format: ServingFormat) {
  return servingFormats.find((option) => option.value === format)?.label ?? "Unbekannt";
}

export function formatLogDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toLocalDateTimeInput(date = new Date()) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

export function localDateTimeToOffset(value: string) {
  const date = new Date(value);
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const minutes = String(absoluteOffset % 60).padStart(2, "0");

  return `${value}:00${sign}${hours}:${minutes}`;
}
