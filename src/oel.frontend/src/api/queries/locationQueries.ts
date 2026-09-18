import type { Coordinates } from "@/models/LocationSuggestion";

export const locationKeys = {
  all: ["locations"] as const,
  nearby: (coordinates: Coordinates | null) => [...locationKeys.all, "nearby", coordinates] as const,
};

export const LOCATION_API_ROUTE = "/location";
