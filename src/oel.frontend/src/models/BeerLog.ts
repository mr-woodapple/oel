import type { Beer } from "@/models/Beer";

export const servingFormats = {
  Draft: 0,
  Can: 1,
  Bottle: 2,
  Cask: 3,
  Other: 4,
} as const;

export type ServingFormat = typeof servingFormats[keyof typeof servingFormats];

export interface BeerLog {
  id: number;
  rating: number;
  format: ServingFormat;
  location: string | null;
  dateLogged: string;
  beerId: number;
  beer?: Beer | null;
  photoUrl: string | null;
}

export type CreateBeerLogInput = Omit<BeerLog, "id" | "beer" | "photoUrl"> & {
  photo: File | null;
};
