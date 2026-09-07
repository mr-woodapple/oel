export interface Beer {
  id: number,

  // Core Identifiers
  name: string,
  brewery: string,
  style: string,
  abv: number | null,
  ibu: number | null,

  // Experience
  appearance: string | null,
  tastingNotes: string | null,
  generalNotes: string | null,
}

export type CreateBeerInput = Omit<Beer, "id">;
