export type Coordinates = { latitude: number; longitude: number };

export type LocationSuggestion = Coordinates & {
  id: string;
  name: string;
  address: string;
  distance: number | null;
};
