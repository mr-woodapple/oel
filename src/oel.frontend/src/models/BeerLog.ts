import type { Beer } from "@/models/Beer";
import type { ServingFormat } from "@/data/servingFormats";

export interface BeerLogLocation {
  name: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface BeerLog {
  id: number;
  rating: number;
  format: ServingFormat;
  location: BeerLogLocation | null;
  dateLogged: string;
  beerId: number;
  beer?: Beer | null;
  photoUrl: string | null;
}

export type CreateBeerLogInput = Omit<BeerLog, "id" | "beer" | "location" | "photoUrl"> & {
  location: BeerLogLocation | null;
  photo: File | null;
};

export type UpdateBeerLogInput = Omit<BeerLog, "beer" | "photoUrl"> & {
  photo: File | null;
  removePhoto: boolean;
};
