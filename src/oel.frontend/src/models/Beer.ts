export interface Beer {
  id?: number,

  // Core Identifiers
  name: string,
  brewery: string,
  style: string,
  abv?: number,
  ibu?: number,

  // Experience
  appearance?: string,
  tastingNotes?: string,
  generateNotes?: string
}
