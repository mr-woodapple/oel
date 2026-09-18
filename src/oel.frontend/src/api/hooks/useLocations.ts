import { useQuery } from "@tanstack/react-query";

import { fetchApi } from "@/api/api";
import { LOCATION_API_ROUTE, locationKeys } from "@/api/queries/locationQueries";
import type { Coordinates, LocationSuggestion } from "@/models/LocationSuggestion";

export function useNearbyLocations(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: locationKeys.nearby(coordinates),
    enabled: coordinates !== null,
    queryFn: ({ signal }) => {
      if (!coordinates) throw new Error("Coordinates are required");
      const params = new URLSearchParams({
        latitude: String(coordinates.latitude), longitude: String(coordinates.longitude),
      });
      return fetchApi<LocationSuggestion[]>(`${LOCATION_API_ROUTE}/nearby?${params}`, { signal });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
